from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from authentication.models import CustomUser

## For CSRF
from django.http import JsonResponse
from django.middleware.csrf import get_token

# Login View
class LoginView(APIView):

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)  # Create session
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
   
# Logout View 
class LogoutView(APIView):

    def post(self, request):
        logout(request)  # Clear session
        return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)

# Register View
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

# CSRF Token View
def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})