from django.urls import path
from .views import TaskListAPIView, TaskDetailAPIView

urlpatterns = [
	path('', TaskListAPIView.as_view(), name='task-list'),
	path('create/', TaskListAPIView.as_view(), name='task-create'),
	path('<uuid:pk>/', TaskDetailAPIView.as_view(), name='task-detail'),
	path('<uuid:pk>/update/', TaskDetailAPIView.as_view(), name='task-update'),
	path('<uuid:pk>/delete/', TaskDetailAPIView.as_view(), name='task-delete'),
]
