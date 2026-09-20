from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Contact

User = get_user_model()

LOCMEM_CACHE = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}


@override_settings(CACHES=LOCMEM_CACHE)
class ContactLimitTests(TestCase):

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(email='u@example.com', password='Pass1234!', first_name='U', last_name='S')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        Contact.objects.bulk_create(
            Contact(owner=self.user, first_name=f'C{i}', color='#000000') for i in range(settings.MAX_CONTACTS_PER_USER)
        )

    def test_creating_beyond_the_contact_limit_is_rejected(self):
        response = self.client.post('/api/contacts/', {'first_name': 'One', 'color': '#000000'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn(f'limit of {settings.MAX_CONTACTS_PER_USER} contacts', str(response.data))
        self.assertEqual(self.user.contacts.count(), settings.MAX_CONTACTS_PER_USER)

    def test_editing_at_the_limit_is_still_allowed(self):
        contact = self.user.contacts.first()
        response = self.client.patch(f'/api/contacts/{contact.id}/', {'first_name': 'renamed'}, format='json')
        self.assertEqual(response.status_code, 200)
