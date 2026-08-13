from rest_framework.viewsets import ModelViewSet

from .models import Subtask, Task
from .serializers import SubtaskSerializer, TaskSerializer


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user).prefetch_related('subtasks', 'contacts')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SubtaskViewSet(ModelViewSet):
    """Direct access to a single subtask, mainly used to toggle 'done'."""

    serializer_class = SubtaskSerializer

    def get_queryset(self):
        return Subtask.objects.filter(task__owner=self.request.user)
