from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/contacts/', include('contacts_app.urls')),
    path('api/tasks/subtasks/', include('tasks_app.subtask_urls')),
    path('api/tasks/', include('tasks_app.urls')),
]
