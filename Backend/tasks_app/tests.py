from datetime import date

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Task

User = get_user_model()

LOCMEM_CACHE = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}


@override_settings(CACHES=LOCMEM_CACHE)
class TaskLimitTests(TestCase):

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(email='u@example.com', password='Pass1234!', first_name='U', last_name='S')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def payload(self, **overrides):
        data = {'title': 'T', 'category': 'User Story', 'due_date': str(date.today())}
        data.update(overrides)
        return data

    def fill_to_limit(self):
        Task.objects.bulk_create(
            Task(owner=self.user, title=f'T{i}', category='User Story', due_date=date.today())
            for i in range(settings.MAX_TASKS_PER_USER)
        )

    def test_creating_beyond_the_task_limit_is_rejected(self):
        self.fill_to_limit()
        response = self.client.post('/api/tasks/', self.payload(), format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn(f'limit of {settings.MAX_TASKS_PER_USER} tasks', str(response.data))
        self.assertEqual(self.user.tasks.count(), settings.MAX_TASKS_PER_USER)

    def test_editing_at_the_limit_is_still_allowed(self):
        self.fill_to_limit()
        task = self.user.tasks.first()
        response = self.client.patch(f'/api/tasks/{task.id}/', {'title': 'renamed'}, format='json')
        self.assertEqual(response.status_code, 200)

    def test_limit_is_per_user(self):
        self.fill_to_limit()
        other = User.objects.create_user(email='o@example.com', password='Pass1234!', first_name='O', last_name='T')
        client = APIClient()
        client.force_authenticate(other)
        self.assertEqual(client.post('/api/tasks/', self.payload(), format='json').status_code, 201)

    def test_description_is_capped(self):
        limit = settings.MAX_DESCRIPTION_LENGTH
        too_long = self.client.post('/api/tasks/', self.payload(description='x' * (limit + 1)), format='json')
        ok = self.client.post('/api/tasks/', self.payload(description='x' * limit), format='json')
        self.assertEqual(too_long.status_code, 400)
        self.assertEqual(ok.status_code, 201)

    def test_subtasks_are_capped(self):
        subtasks = [{'title': f's{i}', 'done': False} for i in range(settings.MAX_SUBTASKS_PER_TASK + 1)]
        response = self.client.post('/api/tasks/', self.payload(subtasks=subtasks), format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn(f'at most {settings.MAX_SUBTASKS_PER_TASK} subtasks', str(response.data))
