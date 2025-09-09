from django.conf import settings
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    path('api/', include('goals.urls')),
]

# Only expose Django admin in dev
if settings.DEBUG:
    urlpatterns += [path("admin/", admin.site.urls)]