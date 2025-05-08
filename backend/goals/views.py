from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Goal, Task, RecurrenceRule
from .serializers import GoalSerializer, TaskSerializer, RecurrenceRuleSerializer

class GoalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# class RecurrenceRuleViewSet(viewsets.ModelViewSet):
#     permission_classes = [IsAuthenticated]
#     serializer_class = RecurrenceRuleSerializer
#     queryset = RecurrenceRule.objects.all()