from django.db import models
from django.conf import settings


class Goal(models.Model):
    GOAL_TYPE_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    goal_type = models.CharField(max_length=10, choices=GOAL_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    completed = models.BooleanField(default=False)
    expired = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.goal_type})"

class RecurrenceRule(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
    ]

    days_of_week = models.JSONField(blank=True, null=True)  # e.g., ["Mon", "Wed", "Fri"]
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    interval = models.PositiveIntegerField(default=1)  # every n days/weeks
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.frequency} every {self.interval}x"

class Task(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, blank=True, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    recurrence = models.ForeignKey(RecurrenceRule, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.title} on {self.date}"