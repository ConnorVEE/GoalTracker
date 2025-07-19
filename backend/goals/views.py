from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Goal, Task
from .serializers import GoalSerializer, TaskSerializer
from django.db.models import Q
from datetime import datetime

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
            try:
                target_date = datetime.strptime(date_param, "%Y-%m-%d").date()
                weekday = target_date.weekday()  # 0 = Monday, 6 = Sunday

                queryset = queryset.filter(
                    Q(date=target_date) |
                    Q(
                        date__isnull=True,
                        recurrence_rule__isnull=False,
                        recurrence_rule__days_of_week__contains=[weekday]
                    )
                )
            except ValueError:
                return Task.objects.none()

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)