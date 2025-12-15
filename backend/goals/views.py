from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Goal, Task, TaskInstance
from .serializers import GoalSerializer, TaskSerializer, TaskInstanceSerializer
from django.db.models import Q
from datetime import datetime, timedelta

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user)

        date_param = self.request.query_params.get("date")
        start_param = self.request.query_params.get("start")
        end_param = self.request.query_params.get("end")
        recurring_param = self.request.query_params.get("recurring")

        # Recurring-only listing (for a page that focuses on recurrence parents)
        if recurring_param == "true":
            return Task.objects.filter(user=user, date__isnull=True, recurrence_rule__isnull=False)

        # If no range or date specified, default to returning user's non-recurring tasks (or all)
        # keep default behaviour simple
        return queryset

    def list(self, request, *args, **kwargs):
        """
        Overridden to return a merged list of:
         - one-off Task objects in range
         - persisted TaskInstance objects in range
         - virtual instances generated from recurring parents for the range
        The frontend should call this with either ?date=YYYY-MM-DD or ?start=YYYY-MM-DD&end=YYYY-MM-DD
        """
        user = request.user
        date_param = request.query_params.get("date")
        start_param = request.query_params.get("start")
        end_param = request.query_params.get("end")

        # Helper: gather all results into a flat list of serialized instance-like dicts
        results = []

        # If single date requested, make start=end
        if date_param:
            try:
                date_obj = datetime.strptime(date_param, "%Y-%m-%d").date()
                start_date = end_date = date_obj
            except ValueError:
                return Response([], status=status.HTTP_400_BAD_REQUEST)
        elif start_param and end_param:
            try:
                start_date = datetime.strptime(start_param, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_param, "%Y-%m-%d").date()
            except ValueError:
                return Response([], status=status.HTTP_400_BAD_REQUEST)
        else:
            # fallback: return default queryset paginated
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # 1) one-off tasks in range (Task.date is not null)
        single_tasks = Task.objects.filter(
            user=user,
            date__range=(start_date, end_date),
            recurrence_rule__isnull=True
        )
        single_serialized = TaskSerializer(single_tasks, many=True).data
        results.extend(single_serialized)

        # 2) persisted instances in range (TaskInstance)
        persisted_instances = TaskInstance.objects.filter(
            parent__user=user,
            due_date__range=(start_date, end_date)
        ).select_related('parent')
        persisted_serialized = TaskInstanceSerializer(persisted_instances, many=True).data
        results.extend(persisted_serialized)

        # 3) recurring parent tasks
        parent_tasks = Task.objects.filter(
            user=user,
            date__isnull=True,
            recurrence_rule__isnull=False
        )
        parent_serialized = TaskSerializer(parent_tasks, many=True).data
        results.extend(parent_serialized)

        # For frontend convenience, sort results by date (and optionally by time/priority)
        # Each item has a 'date' key in the serialized form (TaskSerializer uses 'date' for Task, TaskInstanceSerializer uses due_date as 'date')
        results_sorted = sorted(results, key=lambda x: x.get('date') or "")

        return Response(results_sorted)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Mark a task or recurring parent occurrence complete.
        For a parent + date -> create or update TaskInstance
        For a single Task (non-recurring) -> toggle / set completed on Task
        Expect a query param: ?date=YYYY-MM-DD for recurring parents.
        """
        user = request.user
        try:
            task = Task.objects.get(pk=pk, user=user)
        except Task.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        date_param = request.query_params.get("date")

        if task.recurrence_rule and date_param:
            try:
                date_obj = datetime.strptime(date_param, "%Y-%m-%d").date()
            except ValueError:
                return Response({"detail": "Invalid date"}, status=status.HTTP_400_BAD_REQUEST)

            instance, created = TaskInstance.objects.get_or_create(parent=task, due_date=date_obj)
            instance.completed = True
            instance.save()
            return Response(TaskInstanceSerializer(instance).data)
        
        else:
            completed = request.data.get('completed')
            if completed is None:
                task.completed = not task.completed
            else:
                task.completed = bool(completed)
            task.save()

            return Response(TaskSerializer(task).data)
        
class TaskInstanceViewSet(viewsets.ModelViewSet):
    queryset = TaskInstance.objects.all()
    serializer_class = TaskInstanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskInstance.objects.filter(parent__user=self.request.user)
