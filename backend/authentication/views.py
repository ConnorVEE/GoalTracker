from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from authentication.models import CustomUser
## For CSRF
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

# Login View
class LoginView(APIView):

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        print("Attempting login with:", email, password)  # debug line

        user = authenticate(request, email=email, password=password)

        print("Authenticate returned:", user)  # debug line

        if user is not None:
            login(request, user)
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

    def post(self, request):

        email = request.data.get("email")
        first_name = request.data.get("first_name")
        password = request.data.get("password")

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email is already in use"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(email=email, first_name=first_name, password=password)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# CSRF Token View
class CSRFTokenView(APIView):
    @ensure_csrf_cookie
    def get(self, request, *args, **kwargs):
        return JsonResponse({"csrfToken": request.META.get("CSRF_COOKIE")})
# class CSRFTokenView(APIView):
#     def get(self, request, *args, **kwargs):
#         token = get_token(request)  # ensures a CSRF token exists

#         response = JsonResponse({"csrfToken": token})
#         response.set_cookie(
#             "csrftoken",           # Cookie name Django expects
#             token,                 # The CSRF token
#             domain=".todoallday.com", # matches your frontend domain
#             secure=True,           # must be True for HTTPS
#             httponly=False,        # must be False so JS (Axios) can read it
#             samesite="None",       # required for cross-site cookies
#         )
#         return response

def get_user(request):
    if request.user.is_authenticated:
        return JsonResponse({"user": {"first_name": request.user.first_name}})
    return JsonResponse({"user": None})