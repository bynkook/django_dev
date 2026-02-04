from django.urls import path
from .views import GraphicWalkerDataView

urlpatterns = [
    path('data/', GraphicWalkerDataView.as_view(), name='graphic-walker-data'),
]
