from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Task Service API",
        default_version='v1',
        description="Some description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@apps.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    path('supersecret/', admin.site.urls),
    path('api/v1/tasks/', include('tasks.urls')),
    
    # docs
    path('swagger(<format>\.json|\.yaml)/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]


admin.site.site_header = "Task Genie Admin"
admin.site.site_title = "Task Genie Admin Portal"
admin.site.index_title = "Welcome to Task Genie portal"
