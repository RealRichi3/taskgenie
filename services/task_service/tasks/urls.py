from django.urls import path
from .views import TaskListAPIView, TaskCreateAPIView, TaskDetailAPIView, TaskUpdateAPIView, TaskDeleteAPIView

urlpatterns = [
    path('tasks/', TaskListAPIView.as_view(), name='task-list'),
    path('tasks/create/', TaskCreateAPIView.as_view(), name='task-create'),
    path('tasks/<uuid:pk>/', TaskDetailAPIView.as_view(), name='task-detail'),
    path('tasks/<uuid:pk>/update/', TaskUpdateAPIView.as_view(), name='task-update'),
    path('tasks/<uuid:pk>/delete/', TaskDeleteAPIView.as_view(), name='task-delete'),
]
