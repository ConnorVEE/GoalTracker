from django.urls import path
from authentication.views import LoginView, LogoutView, RegisterView, get_user, CSRFTokenView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', get_user, name='getUser'),
    path('csrf/', CSRFTokenView.as_view(), name='csrf_token')
]
