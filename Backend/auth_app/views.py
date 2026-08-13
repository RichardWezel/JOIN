import random

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from contacts_app.models import Contact

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

User = get_user_model()

CONTACT_COLORS = [
    '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF',
    '#FFBB2B', '#1FD7C1', '#462F8A', '#FF4646', '#00BEE8',
]

GUEST_EMAIL = 'guest@join.local'


def build_auth_response(user):
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user': UserSerializer(user).data})


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(color=random.choice(CONTACT_COLORS))
        Contact.objects.create(
            owner=user,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            color=user.color,
        )
        return build_auth_response(user)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email=serializer.validated_data['email']).first()
        if user is None or not user.check_password(serializer.validated_data['password']):
            return Response({'detail': 'Email or password is incorrect.'}, status=status.HTTP_401_UNAUTHORIZED)
        return build_auth_response(user)


class GuestLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user, created = User.objects.get_or_create(
            email=GUEST_EMAIL,
            defaults={'first_name': 'Guest', 'last_name': '', 'color': '#FF7A00'},
        )
        if created:
            user.set_unusable_password()
            user.save()
            Contact.objects.create(
                owner=user, first_name='Guest', last_name='', email='', color=user.color,
            )
        return build_auth_response(user)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
