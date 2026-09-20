# Join Backend

Django REST Framework API for the Join Kanban board frontend.

## Setup

```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Copy `.env.example` to `.env` and adjust if needed (a working `.env` for local dev is already provided).

API runs at `http://127.0.0.1:8000/api/`.

## Demo data and daily reset

`demo_data.json` describes the example project shown in the guest account:
the team as contacts and the tasks across all four columns. Due dates are
stored as `due_in_days` relative to the day of the reset, so the board never
looks stale.

```bash
python manage.py reset_demo              # remove visitor accounts, rebuild the guest project
python manage.py reset_demo --keep-users # rebuild the guest project only
```

The first guest login on an empty database seeds the same data. In
production the command runs nightly from cron; superusers are never touched,
and one is created on the first run if `DJANGO_SUPERUSER_EMAIL` /
`DJANGO_SUPERUSER_PASSWORD` are set in `.env`.

## Abuse limits

The instance is public, so a few guard rails are built in:

| What | Limit | Where |
|---|---|---|
| Login, register, guest-login | 10 requests / minute / IP (`AUTH_THROTTLE_RATE`) | `auth_app/views.py` |
| Tasks per account | 50 | `MAX_TASKS_PER_USER` |
| Contacts per account | 50 | `MAX_CONTACTS_PER_USER` |
| Subtasks per task | 20 | `MAX_SUBTASKS_PER_TASK` |
| Task description | 2 000 characters | `MAX_DESCRIPTION_LENGTH` |

Editing existing items is always allowed, only creating new ones counts.
The numbers live in `core/settings.py`; the tests read them from there.
Throttle counters live in a file based cache (`.cache/`), shared by all
gunicorn workers. Behind nginx set `NUM_PROXIES=1` so the limit applies per
visitor IP.

## Auth

Token-based (`Authorization: Token <token>` header).

- `POST /api/auth/register/` — `{email, first_name, last_name, password, repeated_password}` → `{token, user}`
- `POST /api/auth/login/` — `{email, password}` → `{token, user}`
- `POST /api/auth/guest-login/` — no body, logs into a shared demo account → `{token, user}`
- `GET /api/auth/me/` — current user

## Contacts

`GET/POST /api/contacts/`, `GET/PUT/PATCH/DELETE /api/contacts/{id}/` — scoped to the logged-in user.

## Tasks

`GET/POST /api/tasks/`, `GET/PUT/PATCH/DELETE /api/tasks/{id}/` — scoped to the logged-in user.

Task fields: `title, description, category (Technical Task|User Story), due_date (YYYY-MM-DD), priority (Low|Medium|Urgent), status (toDo|inProgress|awaitFeedback|done), contacts (list of contact ids), subtasks (list of {title, done})`.

`PATCH/DELETE /api/tasks/subtasks/{id}/` — toggle a single subtask's `done` flag without resending the whole task.
