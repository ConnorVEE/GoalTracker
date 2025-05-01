from rest_framework import serializers
from .models import Goal, Task, RecurrenceRule

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class RecurrenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = '__all__'