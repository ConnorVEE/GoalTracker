from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Goal, Task, RecurrenceRule
from .serializers import GoalSerializer, TaskSerializer, RecurrenceSerializer

class GoalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):

        print(f"Creating goal for user: {self.request.user} (id: {self.request.user.id})")

        serializer.save(user=self.request.user)

    # def perform_create(self, serializer):
    #     if serializer.is_valid():
    #         print(f"Creating goal for user: {self.request.user} (id: {self.request.user.id})")
    #         serializer.save(user=self.request.user)
    #     else:
    #         print("ERRORS HERE:")
    #         print(serializer.errors)
    # ^^For Debugging purposes^^


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