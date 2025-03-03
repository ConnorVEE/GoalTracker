from django.urls import path
from authentication.views import LoginView, LogoutView, RegisterView, get_csrf_token

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path("csrf/", get_csrf_token, name="csrf"),
]
