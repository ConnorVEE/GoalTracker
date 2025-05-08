from rest_framework import serializers
from .models import Goal, Task, RecurrenceRule

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'created_at', 'due_date', 'completed', 'expired', 'user']
        read_only_fields = ['id', 'created_at', 'user']


class RecurrenceRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = ['id', 'start_date', 'end_date', 'days_of_week']


class TaskSerializer(serializers.ModelSerializer):
    recurrence_rule = RecurrenceRuleSerializer(required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'date', 'time', 'completed',
            'goal', 'recurrence_rule', 'user'
        ]
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        # If nested recurrence_rule data is present, extract and create the recurrence rule
        recurrence_data = validated_data.pop('recurrence_rule', None)
        if recurrence_data:
            recurrence = RecurrenceRule.objects.create(**recurrence_data)
            validated_data['recurrence_rule'] = recurrence

        return Task.objects.create(**validated_data)