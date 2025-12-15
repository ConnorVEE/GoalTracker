from rest_framework import serializers
from .models import Goal, Task, RecurrenceRule, TaskInstance

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'created_at', 'user', 'due_date']
        read_only_fields = ['id', 'created_at', 'user']

# serializers.py 
class RecurrenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = '__all__'

class TaskInstanceSerializer(serializers.ModelSerializer):
    parent_id = serializers.IntegerField(source='parent.id', read_only=True)
    title = serializers.SerializerMethodField()
    date = serializers.DateField(source='due_date')
    type = serializers.SerializerMethodField()

    class Meta:
        model = TaskInstance
        fields = ['id', 'parent_id', 'title', 'date', 'completed', 'type']

    def get_title(self, obj):
        return obj.title_override or obj.parent.title

    def get_type(self, obj):
        return "instance"

class TaskSerializer(serializers.ModelSerializer):
    recurrence_rule = RecurrenceSerializer(required=False, allow_null=True)
    type = serializers.SerializerMethodField()
    date = serializers.DateField(allow_null=True)

    class Meta:
        model = Task
        fields = ['id', 'goal', 'title', 'date', 'completed', 'user', 'recurrence_rule', 'type']
        read_only_fields = ['id', 'user']

    def get_type(self, obj):
        if obj.recurrence_rule and obj.date is None:
            return "parent"
        return "single"

    def create(self, validated_data):
        recurrence_data = validated_data.pop('recurrence_rule', None)
        recurrence = None

        if recurrence_data:
            recurrence = RecurrenceRule.objects.create(**recurrence_data)

        task = Task.objects.create(
            recurrence_rule=recurrence, 
            **validated_data
            )
        return task

    def update(self, instance, validated_data):
        recurrence_data = validated_data.pop('recurrence_rule', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if recurrence_data and instance.recurrence_rule:
            for attr, value in recurrence_data.items():
                setattr(instance.recurrence_rule, attr, value)
            instance.recurrence_rule.save()
        elif recurrence_data and not instance.recurrence_rule:
            # create new recurrence rule if provided
            instance.recurrence_rule = RecurrenceRule.objects.create(**recurrence_data)
            instance.save()

        # do NOT delete recurrence_rule if recurrence_data is None — keep as-is
        return instance

# class RecurrenceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RecurrenceRule
#         fields = '__all__'

# class TaskSerializer(serializers.ModelSerializer):
#     recurrence_rule = RecurrenceSerializer(required=False)

#     class Meta:
#         model = Task
#         fields = ['id', 'goal', 'title', 'date', 'completed', 'user', 'recurrence_rule']
#         read_only_fields = ['id', 'user']

#     # check if the recurrence_rule provided exists, if not create a new one
#     def create(self, validated_data):
#         recurrence_data = validated_data.pop('recurrence_rule', None)
#         recurrence = None

#         if recurrence_data:
#             recurrence = RecurrenceRule.objects.create(**recurrence_data)

#         task = Task.objects.create(recurrence_rule=recurrence, **validated_data)
#         return task
    
#     def update(self, instance, validated_data):
#         recurrence_data = validated_data.pop('recurrence_rule', None)

#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         if recurrence_data and instance.recurrence_rule:
#             for attr, value in recurrence_data.items():
#                 setattr(instance.recurrence_rule, attr, value)
#             instance.recurrence_rule.save()


#         return instance