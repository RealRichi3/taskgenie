from django.db import models
import uuid
from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _

class TimeStampedUUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class TaskStatus(TextChoices):
    CREATED = 'created', _('Created')
    ASSIGNED = 'assigned', _('Assigned')
    COMPLETED = 'completed', _('Completed')
    CANCELED = 'canceled', _('Canceled')

class Task(TimeStampedUUIDModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=TaskStatus.choices, default=TaskStatus.CREATED)
    client = models.CharField(max_length=36)
    worker = models.CharField(max_length=36, null=True, blank=True)

    def __str__(self):
        return self.title