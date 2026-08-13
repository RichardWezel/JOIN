from rest_framework.viewsets import ModelViewSet

from .models import Contact
from .serializers import ContactSerializer


class ContactViewSet(ModelViewSet):
    serializer_class = ContactSerializer

    def get_queryset(self):
        return Contact.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
