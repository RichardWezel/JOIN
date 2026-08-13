from django.contrib import admin

from .models import Subtask, Task

admin.site.register(Task)
admin.site.register(Subtask)
