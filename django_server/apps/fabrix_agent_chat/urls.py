from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatSessionViewSet, SignUpView, LoginView

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='session')

urlpatterns = [
    # Auth
    path('auth/signup/', SignUpView.as_view(), name='signup'),
    path('auth/login/', LoginView.as_view(), name='login'),
    
    # Chat API (Sessions & Messages)
    path('', include(router.urls)),
]