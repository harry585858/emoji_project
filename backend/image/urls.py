from django.urls import path, include
from .views import ImagesAPIView, ImageAPIView,ImagesByTitleAPIView

urlpatterns = [
    path('', ImagesAPIView.as_view()),
    path('<int:pk>/',ImageAPIView().as_view()),
    path('title/<str:title>/',ImagesByTitleAPIView().as_view()),
]