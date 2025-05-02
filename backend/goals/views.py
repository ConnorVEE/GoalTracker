from rest_framework import viewsets
from .models import Goal, Task
from .serializers import GoalSerializer, TaskSerializer

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    # Sets the user to the currently authenticated user when creating a new goal
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Filters the tasks to only show those belonging to the currently authenticated user
    def get_queryset(self):         
        return Goal.objects.filter(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    # Sets the user to the currently authenticated user when creating a new goal
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Filters the tasks to only show those belonging to the currently authenticated user
    def get_queryset(self):         
        return Goal.objects.filter(user=self.request.user)
    