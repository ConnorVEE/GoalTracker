from django.contrib.auth.backends import BaseBackend
from authentication.models import CustomUser
from django.contrib.auth.hashers import check_password

class EmailBackend(BaseBackend):
    
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return None

        if user and check_password(password, user.password):
            if user.is_active:  # Ensure user account is active
                return user
        
        return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None

