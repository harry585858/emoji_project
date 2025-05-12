from rest_framework import serializers
from .models import Images

class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ['id', 'name', 'image', 'uploader', 'uploaded_at']
        read_only_fields = ['uploader', 'uploaded_at']
