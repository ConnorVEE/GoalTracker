from rest_framework import serializers
from .models import Goal, Task, RecurrenceRule

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'created_at', 'user', 'due_date']
        read_only_fields = ['id', 'created_at', 'user']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'goal', 'title', 'description', 'date', 'time', 'completed', 'recurrence', 'user']
        read_only_fields = ['id', 'user']

class RecurrenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = '__all__'