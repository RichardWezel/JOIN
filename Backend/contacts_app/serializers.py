from django.conf import settings
from rest_framework import serializers

from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'color']

    def validate(self, attrs):
        # Only new contacts count against the quota; editing is always allowed.
        if self.instance is None:
            owner = self.context['request'].user
            if owner.contacts.count() >= settings.MAX_CONTACTS_PER_USER:
                raise serializers.ValidationError(
                    f'You have reached the limit of {settings.MAX_CONTACTS_PER_USER} contacts.'
                )
        return attrs
