from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from authentication.models import CustomUser
## For CSRF
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

# Login View
class LoginView(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            # Optionally refresh CSRF token after login
            token = get_token(request)
            response = JsonResponse({
                "message": "Login successful",
                "user": {"first_name": user.first_name},
                "csrfToken": token
            })
            response.set_cookie(
                "csrftoken",
                token,
                domain=".todoallday.com",
                secure=True,
                httponly=False,
                samesite="None"
            )
            return response

        return JsonResponse({"error": "Invalid credentials"}, status=401)
   
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
    @csrf_exempt
    def get(self, request, *args, **kwargs):
        token = get_token(request)  # generate CSRF token

        response = JsonResponse({"csrfToken": token})
        response.set_cookie(
            "csrftoken",                # Django expects this name
            token,                      # the token
            domain=".todoallday.com",   # your main domain
            secure=True,                 # must be True for HTTPS
            httponly=False,              # must be False so JS can read it
            samesite="None",             # cross-site allowed
        )
        return response

def get_user(request):
    if request.user.is_authenticated:
        return JsonResponse({"user": {"first_name": request.user.first_name}})
    return JsonResponse({"user": None})