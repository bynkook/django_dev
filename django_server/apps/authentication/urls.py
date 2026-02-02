from django.urls import path
from .views import SignUpView, LoginView, LogoutView, UserProfileView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='auth-signup'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('profile/', UserProfileView.as_view(), name='auth-profile'),
]
