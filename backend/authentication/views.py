from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from authentication.models import CustomUser

## For CSRF
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

# Login View
class LoginView(APIView):

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)  # ✅ Creates session
            return Response({'message': 'Login successful', "user": {"first_name": user.first_name}}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
   
# Logout View 
class LogoutView(APIView):
    
    def post(self, request):
        if request.method == "POST":
            request.session.flush() 
            return JsonResponse({"message": "Logged out"}, status=200)
    
        return JsonResponse({"error": "Invalid request"}, status=400)

# Register View
class RegisterView(APIView):

    @csrf_exempt
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
class CSRFTokenView(APIView):
    def get(self, request, *args, **kwargs):  # Fix the method signature
        token = get_token(request)  # Retrieves CSRF token from session
        request.session['csrf_token'] = token  # Store explicitly in session (optional)
        return JsonResponse({"csrfToken": token})

def get_user(request):
    if request.user.is_authenticated:
        return JsonResponse({"user": {"first_name": request.user.first_name}})
    return JsonResponse({"user": None})