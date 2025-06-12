from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import ArrayField

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
    end_date = models.DateField(blank=True, null=True) 
    days_of_week = ArrayField(
        models.IntegerField(choices=[(i, i) for i in range(7)]),
        blank=True,
        null=True,
        help_text="Days of the week this task recurs on. 0=Mon, 6=Sun"
    )

    def __str__(self):
        return f"Repeats on {self.days_of_week} from {self.start_date}"

class Task(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    date = models.DateField()
    completed = models.BooleanField(default=False)

    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, blank=True, null=True)
    recurrence_rule = models.ForeignKey('RecurrenceRule', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.title} on {self.date}"