from django.conf import settings
from django.db import models

from contacts_app.models import Contact


class Task(models.Model):
    CATEGORY_CHOICES = [
        ('Technical Task', 'Technical Task'),
        ('User Story', 'User Story'),
    ]
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('Urgent', 'Urgent'),
    ]
    STATUS_CHOICES = [
        ('toDo', 'To do'),
        ('inProgress', 'In Progress'),
        ('awaitFeedback', 'Await Feedback'),
        ('done', 'Done'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    due_date = models.DateField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='toDo')
    contacts = models.ManyToManyField(Contact, related_name='tasks', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title


class Subtask(models.Model):
    task = models.ForeignKey(Task, related_name='subtasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.title
