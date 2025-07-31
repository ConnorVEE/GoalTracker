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
        start_param = self.request.query_params.get("start")
        end_param = self.request.query_params.get("end")
        recurring_param = self.request.query_params.get("recurring")

        # Return recurring tasks only (Recurring Tasks Page)
        if recurring_param == "true":
            return Task.objects.filter(
                user=user,
                # date__isnull=True,
                recurrence_rule__isnull=False
            )

        # Single-day fetch (Home Page)
        if date_param:
            try:
                target_date = datetime.strptime(date_param, "%Y-%m-%d").date()
                js_weekday = (target_date.weekday() + 1) % 7

                single_tasks = Task.objects.filter(user=user, date=target_date)

                recurring_tasks = Task.objects.filter(
                    user=user,
                    date__isnull=True,
                    recurrence_rule__isnull=False,
                    # May change later to only use
                    recurrence_rule__days_of_week__contains=[js_weekday]
                )

                queryset = (single_tasks | recurring_tasks).distinct()
            except ValueError:
                return Task.objects.none()

        # Range fetch (Calendar)
        elif start_param and end_param:
            try:
                start_date = datetime.strptime(start_param, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_param, "%Y-%m-%d").date()

                # All single-day tasks in range
                single_tasks = Task.objects.filter(
                    user=user,
                    date__range=(start_date, end_date)
                )

                # All recurring tasks (we'll let frontend decide which days they belong to)
                recurring_tasks = Task.objects.filter(
                    user=user,
                    date__isnull=True,
                    recurrence_rule__isnull=False
                )

                queryset = (single_tasks | recurring_tasks).distinct()
            except ValueError:
                return Task.objects.none()

        return queryset
    
    def perform_create(self, serializer):
        print(f"Creating task for user: {self.request.user} (id: {self.request.user.id})")
        serializer.save(user=self.request.user)