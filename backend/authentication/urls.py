from django.urls import path
from authentication.views import (
    RegisterView,
    JWTLoginView,
    JWTLogoutView,
    JWTRefreshView,
    CurrentUserView,


    ping_protected,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", JWTLoginView.as_view(), name="login"),
    path("logout/", JWTLogoutView.as_view(), name="logout"),
    path("refresh/", JWTRefreshView.as_view(), name="token_refresh"),
    path("user/", CurrentUserView.as_view(), name="current_user"),


    path('ping/', ping_protected, name='ping'),
]