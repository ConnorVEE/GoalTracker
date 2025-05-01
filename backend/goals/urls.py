from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]