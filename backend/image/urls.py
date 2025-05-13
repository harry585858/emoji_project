from django.urls import path, include
from .views import ImagesAPIView, ImageAPIView

urlpatterns = [
    path('', ImagesAPIView.as_view()),
    path('<int:pk>/',ImageAPIView.as_view()),
]