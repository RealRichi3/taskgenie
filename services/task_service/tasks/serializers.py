from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.Serializer):
	id = serializers.UUIDField(read_only=True)
	title = serializers.CharField(max_length=255)
	description = serializers.CharField(allow_blank=True)
	location = serializers.CharField(max_length=255)
	price = serializers.DecimalField(max_digits=10, decimal_places=2)
	status = serializers.CharField(max_length=20)
	client = serializers.CharField(max_length=36)
	worker = serializers.CharField(max_length=36, allow_null=True, allow_blank=True)
	created_at = serializers.DateTimeField(read_only=True)
	updated_at = serializers.DateTimeField(read_only=True)

	def create(self, validated_data):
		return Task.objects.create(**validated_data)

	def update(self, instance, validated_data):
		instance.title = validated_data.get('title', instance.title)
		instance.description = validated_data.get('description', instance.description)
		instance.location = validated_data.get('location', instance.location)
		instance.price = validated_data.get('price', instance.price)
		instance.status = validated_data.get('status', instance.status)
		instance.client = validated_data.get('client', instance.client)
		instance.worker = validated_data.get('worker', instance.worker)
		instance.save()
		return instance
