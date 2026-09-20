from django.conf import settings
from rest_framework import serializers

from contacts_app.models import Contact
from contacts_app.serializers import ContactSerializer

from .models import Subtask, Task


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'done']


class TaskSerializer(serializers.ModelSerializer):
    description = serializers.CharField(
        required=False, allow_blank=True, max_length=settings.MAX_DESCRIPTION_LENGTH,
    )
    subtasks = SubtaskSerializer(many=True, required=False)
    contacts = serializers.PrimaryKeyRelatedField(many=True, queryset=Contact.objects.all(), required=False)
    contacts_detail = ContactSerializer(source='contacts', many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'due_date', 'priority',
            'status', 'contacts', 'contacts_detail', 'subtasks', 'created_at',
        ]

    def validate_contacts(self, contacts):
        owner = self.context['request'].user
        for contact in contacts:
            if contact.owner_id != owner.id:
                raise serializers.ValidationError('Unknown contact.')
        return contacts

    def validate_subtasks(self, subtasks):
        if len(subtasks) > settings.MAX_SUBTASKS_PER_TASK:
            raise serializers.ValidationError(
                f'A task can have at most {settings.MAX_SUBTASKS_PER_TASK} subtasks.'
            )
        return subtasks

    def validate(self, attrs):
        # Only new tasks count against the quota; editing an existing one is always allowed.
        if self.instance is None:
            owner = self.context['request'].user
            if owner.tasks.count() >= settings.MAX_TASKS_PER_USER:
                raise serializers.ValidationError(
                    f'You have reached the limit of {settings.MAX_TASKS_PER_USER} tasks.'
                )
        return attrs

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        contacts = validated_data.pop('contacts', [])
        task = Task.objects.create(**validated_data)
        task.contacts.set(contacts)
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=task, **subtask_data)
        return task

    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', None)
        contacts = validated_data.pop('contacts', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if contacts is not None:
            instance.contacts.set(contacts)
        if subtasks_data is not None:
            instance.subtasks.all().delete()
            for subtask_data in subtasks_data:
                Subtask.objects.create(task=instance, **subtask_data)
        return instance
