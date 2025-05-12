from django.urls import path
from .views import ImagesUploadView

urlpatterns = [
    path('upload/', ImagesUploadView.as_view(), name='upload'),
]