from rest_framework import serializers
from .models import Goal, Task, RecurrenceRule

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'created_at', 'user', 'due_date']
        read_only_fields = ['id', 'created_at', 'user']


class RecurrenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    recurrence_rule = RecurrenceSerializer(required=False)

    class Meta:
        model = Task
        fields = ['id', 'goal', 'title', 'description', 'date', 'time', 'completed', 'user', 'recurrence_rule']
        read_only_fields = ['id', 'user', 'completed']

    # check if the recurrence_rule provided exists, if not create a new one
    def create(self, validated_data):
        recurrence_data = validated_data.pop('recurrence_rule', None)
        recurrence = None

        if recurrence_data:
            recurrence = RecurrenceRule.objects.filter(
                start_date=recurrence_data['start_date'],
                end_date=recurrence_data.get('end_date'),
                days_of_week=recurrence_data.get('days_of_week')
            ).first()
            if not recurrence:
                recurrence = RecurrenceRule.objects.create(**recurrence_data)

        task = Task.objects.create(recurrence_rule=recurrence, **validated_data)
        return task

# class TaskSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Task
#         fields = ['id', 'goal', 'title', 'description', 'date', 'time', 'recurrence_rule', 'completed', 'user']
#         read_only_fields = ['id', 'user', 'completed']