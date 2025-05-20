from django.conf import settings
from django.db import models

class Goal(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    completed = models.BooleanField(default=False)
    expired = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title}"

class RecurrenceRule(models.Model):
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)  # Null = repeat forever
    days_of_week = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Repeats on {', '.join(self.days_of_week)} from {self.start_date}"

class Task(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField(blank=True, null=True)
    completed = models.BooleanField(default=False)

    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, blank=True, null=True)
    recurrence_rule = models.ForeignKey('RecurrenceRule', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.title} on {self.date}"