from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatSessionViewSet, SignUpView, LoginView, AgentListView # AgentListView import 추가

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='session')

urlpatterns = [
    # Auth
    path('auth/signup/', SignUpView.as_view(), name='signup'),
    path('auth/login/', LoginView.as_view(), name='login'),
    
    # [추가] Agent List Proxy API
    path('agents/', AgentListView.as_view(), name='agent-list'),
    
    # Chat API
    path('', include(router.urls)),
]