from django.urls import path
from .views import PygWalkerHTMLView

urlpatterns = [
    path('html/', PygWalkerHTMLView.as_view(), name='pygwalker-html'),
]
