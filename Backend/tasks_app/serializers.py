from rest_framework import serializers

from contacts_app.models import Contact
from contacts_app.serializers import ContactSerializer

from .models import Subtask, Task


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'done']


class TaskSerializer(serializers.ModelSerializer):
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
