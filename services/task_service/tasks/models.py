from django.db import models
import uuid
from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


class TimeStampedUUIDModel(models.Model):
	pkid = models.BigAutoField(_("primary key id"), primary_key=True, editable=False)
	id = models.UUIDField(_("Id"), default=uuid.uuid4, editable=False, unique=True)
	created_at = models.DateTimeField(_("Created"), auto_now_add=True)
	updated_at = models.DateTimeField(_("Updated"), auto_now=True)

	class Meta:
		abstract = True


class Task(TimeStampedUUIDModel):
	class TaskStatus(TextChoices):
		CREATED = 'created', _('Created')
		ASSIGNED = 'assigned', _('Assigned')
		COMPLETED = 'completed', _('Completed')
		CANCELED = 'canceled', _('Canceled')
  
	title = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	location = models.CharField(max_length=255)
	price = models.DecimalField(max_digits=10, decimal_places=2)
	status = models.CharField(max_length=20, choices=TaskStatus.choices, default=TaskStatus.CREATED)
	client = models.CharField(max_length=36)
	worker = models.CharField(max_length=36, null=True, blank=True)
 
	class Meta:
		verbose_name = "Task"
		verbose_name_plural = "Tasks"

	def __str__(self):
		return self.title

	def save(self, *args, **kwargs):
		self.title = str.title(self.title)
		self.description = str.capitalize(self.description)
		super().save(*args, **kwargs)