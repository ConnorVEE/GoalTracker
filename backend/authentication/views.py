from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth import authenticate
from authentication.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# Helper to set refresh cookie
def set_refresh_cookie(response, refresh_token):
    response.set_cookie(
        key=settings.SIMPLE_JWT.get("AUTH_COOKIE", "refresh_token"),
        value=str(refresh_token),
        httponly=True,
        secure=not settings.DEBUG,  # secure only in production
        samesite="None",            # allow cross-site
        max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
    )
    return response

# REGISTER
class RegisterView(APIView):
    def post(self, request):
        print("DEBUG REGISTER request.data:", request.data)  # 👈 Add this

        email = request.data.get("email")
        first_name = request.data.get("first_name")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email is already in use"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(email=email, first_name=first_name, password=password)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# class RegisterView(APIView):
#     def post(self, request):
#         email = request.data.get("email")
#         first_name = request.data.get("first_name")
#         password = request.data.get("password")

#         if CustomUser.objects.filter(email=email).exists():
#             return Response({"error": "Email is already in use"}, status=status.HTTP_400_BAD_REQUEST)

#         user = CustomUser.objects.create_user(email=email, first_name=first_name, password=password)
#         return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


# LOGIN
class JWTLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            "access": access_token,
            "user": {"email": user.email, "first_name": user.first_name},
        }, status=status.HTTP_200_OK)

        # set refresh token in cookie
        return set_refresh_cookie(response, refresh)


# REFRESH
class JWTRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT.get("AUTH_COOKIE", "refresh_token"))
        if not refresh_token:
            return Response({"error": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"access": access_token}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)


# LOGOUT
class JWTLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT.get("AUTH_COOKIE", "refresh_token"))
        return response


# GET CURRENT USER
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "first_name": user.first_name,
        })

# from django.contrib.auth import authenticate, login
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status
# from authentication.models import CustomUser

# ## For CSRF
# from django.http import JsonResponse
# from django.middleware.csrf import get_token
# from django.views.decorators.csrf import csrf_exempt

# # Login View
# class LoginView(APIView):

#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         print("Attempting login with:", email, password)  # debug line

#         user = authenticate(request, email=email, password=password)

#         print("Authenticate returned:", user)  # debug line

#         if user is not None:
#             login(request, user)
#             return Response({'message': 'Login successful', "user": {"first_name": user.first_name}}, status=status.HTTP_200_OK)

#         return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# # class LoginView(APIView):

# #     def post(self, request):
# #         email = request.data.get('email')
# #         password = request.data.get('password')

# #         user = authenticate(request, email=email, password=password)

# #         if user is not None:
# #             login(request, user)  # ✅ Creates session
# #             return Response({'message': 'Login successful', "user": {"first_name": user.first_name}}, status=status.HTTP_200_OK)

# #         return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
   
# # Logout View 
# class LogoutView(APIView):
    
#     def post(self, request):
#         if request.method == "POST":
#             request.session.flush() 
#             return JsonResponse({"message": "Logged out"}, status=200)
    
#         return JsonResponse({"error": "Invalid request"}, status=400)

# # Register View
# class RegisterView(APIView):

#     def post(self, request):

#         email = request.data.get("email")
#         first_name = request.data.get("first_name")
#         password = request.data.get("password")

#         if CustomUser.objects.filter(email=email).exists():
#             return Response({"error": "Email is already in use"}, status=status.HTTP_400_BAD_REQUEST)

#         user = CustomUser.objects.create_user(email=email, first_name=first_name, password=password)
#         return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# # CSRF Token View
# class CSRFTokenView(APIView):
#     def get(self, request, *args, **kwargs):  # Fix the method signature
#         token = get_token(request)  # Retrieves CSRF token from session
#         request.session['csrf_token'] = token  # Store explicitly in session (optional)
#         return JsonResponse({"csrfToken": token})

# def get_user(request):
#     if request.user.is_authenticated:
#         return JsonResponse({"user": {"first_name": request.user.first_name}})
#     return JsonResponse({"user": None})