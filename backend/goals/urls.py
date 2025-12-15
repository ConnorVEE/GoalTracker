from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet, TaskViewSet, TaskInstanceViewSet

router = DefaultRouter()
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'instances', TaskInstanceViewSet, basename='instance')

urlpatterns = [
    path('', include(router.urls)),
]