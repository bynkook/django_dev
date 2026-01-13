from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Frontend에서 호출할 API 경로 (예: /api/sessions/)
    path('api/', include('apps.fabrix_agent_chat.urls')),
]