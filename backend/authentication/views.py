from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from authentication.models import CustomUser
from django.conf import settings

# Login
class LoginView(APIView):

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            response = Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            # Access token setting
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'], 
                value=str(refresh.access_token),
                httponly=True,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            # Refresh token setting
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            return response

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    
# Logout
class LogoutView(APIView):

    def post(self, request):
        response = Response({'message': 'Logged out'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie("refresh_token")
        return response

# Register

class RegisterView(APIView):
    def post(self, request):
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        password = request.data.get("password")

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email is already in use"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(email=email, first_name=first_name, last_name=last_name, password=password)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
