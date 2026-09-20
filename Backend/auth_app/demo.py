"""
Demo data for the public guest account.

The guest account is shared by every visitor who clicks "Guest Log in".
`reset_demo()` wipes whatever they left behind and rebuilds the account
from demo_data.json, so the board always shows a clean, realistic project.
"""

import json
from datetime import date, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction

from contacts_app.models import Contact
from tasks_app.models import Subtask, Task

User = get_user_model()

GUEST_EMAIL = 'guest@join.local'
DEMO_DATA_FILE = settings.BASE_DIR / 'demo_data.json'


def load_demo_data():
    with open(DEMO_DATA_FILE, encoding='utf-8') as file:
        return json.load(file)


def get_or_create_guest():
    user, created = User.objects.get_or_create(
        email=GUEST_EMAIL,
        defaults={'first_name': 'Guest', 'last_name': '', 'color': '#FF7A00'},
    )
    if created:
        user.set_unusable_password()
        user.save()
    return user


def seed_guest_demo(user, data=None):
    """Replaces every contact and task of `user` with the demo project."""
    data = data or load_demo_data()
    today = date.today()

    with transaction.atomic():
        user.tasks.all().delete()
        user.contacts.all().delete()

        contacts_by_key = {}
        for entry in data['contacts']:
            contacts_by_key[entry['key']] = Contact.objects.create(
                owner=user,
                first_name=entry['first_name'],
                last_name=entry.get('last_name', ''),
                email=entry.get('email', ''),
                phone=entry.get('phone', ''),
                color=entry.get('color', '#FF7A00'),
            )

        for entry in data['tasks']:
            task = Task.objects.create(
                owner=user,
                title=entry['title'],
                description=entry.get('description', ''),
                category=entry['category'],
                priority=entry.get('priority', 'Medium'),
                status=entry.get('status', 'toDo'),
                due_date=today + timedelta(days=entry.get('due_in_days', 7)),
            )
            task.contacts.set(contacts_by_key[key] for key in entry.get('contacts', []))
            for subtask in entry.get('subtasks', []):
                Subtask.objects.create(task=task, title=subtask['title'], done=subtask.get('done', False))

    return {
        'contacts': len(data['contacts']),
        'tasks': len(data['tasks']),
    }


def reset_demo(keep_users=False):
    """
    Brings the database back to its public state: guest account with the
    demo project, superusers untouched, everything else gone.

    Returns a dict with the counts for logging.
    """
    with transaction.atomic():
        removed_users = 0
        if not keep_users:
            others = User.objects.filter(is_superuser=False).exclude(email=GUEST_EMAIL)
            removed_users = others.count()
            others.delete()  # cascades to contacts, tasks and auth tokens

        guest = get_or_create_guest()
        counts = seed_guest_demo(guest)

    counts['removed_users'] = removed_users
    return counts
