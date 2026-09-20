from datetime import date, timedelta
from io import StringIO

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.management import call_command
from django.test import TestCase, override_settings
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from contacts_app.models import Contact
from tasks_app.models import Task

from .demo import GUEST_EMAIL, load_demo_data, reset_demo

User = get_user_model()

# Throttle counters must not leak into the real file cache between test runs.
LOCMEM_CACHE = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}


class DemoDataFileTests(TestCase):
    """demo_data.json has to stay consistent with the models."""

    def setUp(self):
        self.data = load_demo_data()

    def test_every_task_references_known_contacts(self):
        keys = {contact['key'] for contact in self.data['contacts']}
        for task in self.data['tasks']:
            for key in task.get('contacts', []):
                self.assertIn(key, keys, f"task '{task['title']}' references unknown contact '{key}'")

    def test_choices_match_the_model(self):
        categories = {choice for choice, _ in Task.CATEGORY_CHOICES}
        priorities = {choice for choice, _ in Task.PRIORITY_CHOICES}
        statuses = {choice for choice, _ in Task.STATUS_CHOICES}
        for task in self.data['tasks']:
            self.assertIn(task['category'], categories)
            self.assertIn(task['priority'], priorities)
            self.assertIn(task['status'], statuses)

    def test_guest_contact_matches_the_guest_user(self):
        """The '(You)' marker in the frontend compares contact and user email."""
        guest = next(c for c in self.data['contacts'] if c['key'] == 'guest')
        self.assertEqual(guest['email'], GUEST_EMAIL)


class ResetDemoTests(TestCase):

    def create_visitor(self, email='visitor@example.com'):
        user = User.objects.create_user(email=email, password='Visitor123!', first_name='Vi', last_name='Sitor')
        Token.objects.create(user=user)
        Contact.objects.create(owner=user, first_name='Someone', color='#000000')
        Task.objects.create(owner=user, title='Leftover', category='User Story', due_date=date.today())
        return user

    def test_seeds_guest_from_json(self):
        data = load_demo_data()
        counts = reset_demo()

        guest = User.objects.get(email=GUEST_EMAIL)
        self.assertFalse(guest.has_usable_password())
        self.assertEqual(guest.contacts.count(), len(data['contacts']))
        self.assertEqual(guest.tasks.count(), len(data['tasks']))
        self.assertEqual(counts['tasks'], len(data['tasks']))

    def test_due_dates_are_relative_to_today(self):
        reset_demo()
        entry = next(t for t in load_demo_data()['tasks'] if t['status'] == 'inProgress')
        task = Task.objects.get(owner__email=GUEST_EMAIL, title=entry['title'])
        self.assertEqual(task.due_date, date.today() + timedelta(days=entry['due_in_days']))

    def test_task_assignments_and_subtasks(self):
        reset_demo()
        entry = next(t for t in load_demo_data()['tasks'] if t['subtasks'] and len(t['contacts']) > 1)
        task = Task.objects.get(owner__email=GUEST_EMAIL, title=entry['title'])
        self.assertEqual(task.contacts.count(), len(entry['contacts']))
        self.assertEqual(task.subtasks.count(), len(entry['subtasks']))
        self.assertEqual(
            task.subtasks.filter(done=True).count(),
            sum(1 for s in entry['subtasks'] if s['done']),
        )

    def test_reset_wipes_guest_leftovers(self):
        reset_demo()
        guest = User.objects.get(email=GUEST_EMAIL)
        Task.objects.create(owner=guest, title='Recruiter test', category='User Story', due_date=date.today())
        Contact.objects.create(owner=guest, first_name='Rubbish', color='#000000')

        reset_demo()

        self.assertFalse(guest.tasks.filter(title='Recruiter test').exists())
        self.assertFalse(guest.contacts.filter(first_name='Rubbish').exists())
        self.assertEqual(guest.tasks.count(), len(load_demo_data()['tasks']))

    def test_reset_removes_visitors_but_keeps_superuser(self):
        self.create_visitor()
        admin = User.objects.create_superuser(email='admin@example.com', password='Admin123!', first_name='A', last_name='D')

        counts = reset_demo()

        self.assertEqual(counts['removed_users'], 1)
        self.assertFalse(User.objects.filter(email='visitor@example.com').exists())
        self.assertFalse(Token.objects.filter(user__email='visitor@example.com').exists())
        self.assertTrue(User.objects.filter(pk=admin.pk).exists())

    def test_keep_users_flag(self):
        visitor = self.create_visitor()

        counts = reset_demo(keep_users=True)

        self.assertEqual(counts['removed_users'], 0)
        self.assertTrue(User.objects.filter(pk=visitor.pk).exists())
        self.assertEqual(visitor.tasks.count(), 1)

    def test_management_command_runs(self):
        out = StringIO()
        call_command('reset_demo', stdout=out)
        self.assertIn('Demo reset', out.getvalue())
        self.assertTrue(User.objects.filter(email=GUEST_EMAIL).exists())


@override_settings(CACHES=LOCMEM_CACHE)
class GuestLoginTests(TestCase):

    def setUp(self):
        cache.clear()  # the auth throttle counts guest logins per IP

    def test_first_guest_login_seeds_demo(self):
        client = APIClient()
        response = client.post('/api/auth/guest-login/')

        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        guest = User.objects.get(email=GUEST_EMAIL)
        self.assertEqual(guest.tasks.count(), len(load_demo_data()['tasks']))

    def test_second_guest_login_keeps_current_state(self):
        client = APIClient()
        client.post('/api/auth/guest-login/')
        guest = User.objects.get(email=GUEST_EMAIL)
        Task.objects.create(owner=guest, title='Added by a visitor', category='User Story', due_date=date.today())

        client.post('/api/auth/guest-login/')

        self.assertTrue(guest.tasks.filter(title='Added by a visitor').exists())


@override_settings(CACHES=LOCMEM_CACHE)
class AuthThrottleTests(TestCase):
    """login, register and guest-login share one bucket of 10 requests per minute per IP."""

    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def test_eleventh_auth_request_is_throttled(self):
        for _ in range(10):
            response = self.client.post('/api/auth/login/', {'email': 'x@example.com', 'password': 'wrong'})
            self.assertEqual(response.status_code, 401)
        response = self.client.post('/api/auth/login/', {'email': 'x@example.com', 'password': 'wrong'})
        self.assertEqual(response.status_code, 429)
        self.assertIn('Retry-After', response.headers)

    def test_bucket_is_shared_between_auth_endpoints(self):
        for _ in range(5):
            self.client.post('/api/auth/login/', {'email': 'x@example.com', 'password': 'wrong'})
        for _ in range(5):
            self.assertEqual(self.client.post('/api/auth/guest-login/').status_code, 200)
        self.assertEqual(self.client.post('/api/auth/register/', {}).status_code, 429)

    def test_other_ip_has_its_own_bucket(self):
        for _ in range(10):
            self.client.post('/api/auth/login/', {'email': 'x@example.com', 'password': 'wrong'})
        other = APIClient(REMOTE_ADDR='203.0.113.7')
        self.assertEqual(other.post('/api/auth/guest-login/').status_code, 200)

    def test_ip_is_taken_from_x_forwarded_for_behind_the_proxy(self):
        """nginx passes the visitor's IP in X-Forwarded-For; DRF must count per visitor, not per proxy."""
        for _ in range(10):
            self.client.post('/api/auth/login/', {'email': 'x@example.com', 'password': 'wrong'},
                             HTTP_X_FORWARDED_FOR='198.51.100.1')
        blocked = self.client.post('/api/auth/login/', {'email': 'x@example.com', 'password': 'wrong'},
                                   HTTP_X_FORWARDED_FOR='198.51.100.1')
        allowed = self.client.post('/api/auth/login/', {'email': 'x@example.com', 'password': 'wrong'},
                                   HTTP_X_FORWARDED_FOR='198.51.100.2')
        self.assertEqual(blocked.status_code, 429)
        self.assertEqual(allowed.status_code, 401)
