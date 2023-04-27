from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Task
from .serializers import TaskSerializer


class TaskListAPIView(APIView):
	def get(self, request):
		tasks = Task.objects.all()
		serializer = TaskSerializer(tasks, many=True)
		return Response(serializer.data)

	def post(self, request):
		serializer = TaskSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailAPIView(APIView):
	def get_object(self, pk):
		task = get_object_or_404(Task, pk=pk)
		return task

	def get(self, request, pk):
		task = self.get_object(pk)
		serializer = TaskSerializer(task)
		return Response(serializer.data)

	def put(self, request, pk):
		task = self.get_object(pk)
		serializer = TaskSerializer(task, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk):
		task = self.get_object(pk)
		task.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
