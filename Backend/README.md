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
