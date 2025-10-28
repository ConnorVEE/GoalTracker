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
        fields = ['id', 'goal', 'title', 'date', 'completed', 'user', 'recurrence_rule']
        read_only_fields = ['id', 'user']

    # check if the recurrence_rule provided exists, if not create a new one
    def create(self, validated_data):
        recurrence_data = validated_data.pop('recurrence_rule', None)
        recurrence = None

        if recurrence_data:
            recurrence = RecurrenceRule.objects.create(**recurrence_data)

        task = Task.objects.create(recurrence_rule=recurrence, **validated_data)
        return task
    
    def update(self, instance, validated_data):
        # Extract nested recurrence data
        recurrence_data = validated_data.pop('recurrence_rule', None)

        # Update simple task fields (title, completed, date, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If recurrence data is provided, update the existing recurrence rule
        if recurrence_data and instance.recurrence_rule:
            for attr, value in recurrence_data.items():
                setattr(instance.recurrence_rule, attr, value)
            instance.recurrence_rule.save()

        # Otherwise, leave it as-is — don’t delete or create new rules

        return instance