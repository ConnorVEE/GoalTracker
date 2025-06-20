from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Goal, Task
from .serializers import GoalSerializer, TaskSerializer

class GoalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):

        print(f"Creating goal for user: {self.request.user} (id: {self.request.user.id})")

        serializer.save(user=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user)

        date_param = self.request.query_params.get("date")
        
        if date_param:
            queryset = queryset.filter(date=date_param)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)