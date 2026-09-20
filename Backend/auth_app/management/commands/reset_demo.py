"""
Resets the database to its public demo state.

    python manage.py reset_demo              # wipe visitors, rebuild guest demo
    python manage.py reset_demo --keep-users # rebuild guest demo only

Meant to run once a day from cron. Also makes sure a superuser exists when
DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD are set in .env - an
existing superuser is never touched.
"""

from decouple import config
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from auth_app.demo import reset_demo

User = get_user_model()


class Command(BaseCommand):
    help = 'Wipes visitor data and rebuilds the guest account from demo_data.json.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--keep-users',
            action='store_true',
            help='Keep registered users and their data; only rebuild the guest account.',
        )

    def handle(self, *args, **options):
        counts = reset_demo(keep_users=options['keep_users'])
        self.ensure_superuser()
        self.stdout.write(self.style.SUCCESS(
            f"Demo reset: {counts['contacts']} contacts, {counts['tasks']} tasks seeded, "
            f"{counts['removed_users']} visitor account(s) removed."
        ))

    def ensure_superuser(self):
        email = config('DJANGO_SUPERUSER_EMAIL', default='')
        password = config('DJANGO_SUPERUSER_PASSWORD', default='')
        if not email or not password:
            self.stdout.write('DJANGO_SUPERUSER_EMAIL / _PASSWORD not set - superuser check skipped.')
            return
        if User.objects.filter(is_superuser=True).exists():
            return
        User.objects.create_superuser(email=email, password=password, first_name='Admin', last_name='')
        self.stdout.write(self.style.WARNING(f'No superuser found - created {email}.'))
