from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Goal, Task, TaskInstance
from .serializers import GoalSerializer, TaskSerializer, TaskInstanceSerializer
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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user)

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

class TaskInstanceViewSet(viewsets.ModelViewSet):
    queryset = TaskInstance.objects.all()
    serializer_class = TaskInstanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskInstance.objects.filter(parent__user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def get_or_create_instance(self, request):
        """
        Ensure a TaskInstance exists for a given parent + due_date.
        If it doesn't exist, create it.
        Returns the instance.
        """
        user = request.user
        parent_id = request.data.get("parent_id")
        due_date_str = request.data.get("due_date")

        if not parent_id or not due_date_str:
            return Response(
                {"detail": "parent_id and due_date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate parent
        try:
            parent_task = Task.objects.get(id=parent_id, user=user)
        except Task.DoesNotExist:
            return Response(
                {"detail": "Parent task not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Parse due_date
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Invalid due_date format."}, status=400)

        # Get or create the real instance
        instance, created = TaskInstance.objects.get_or_create(
            parent=parent_task,
            due_date=due_date
        )

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)