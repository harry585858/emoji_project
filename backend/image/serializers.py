from rest_framework import serializers
from .models import Images

class ImageSimpleSerializer(serializers.ModelSerializer):
    imageURL = serializers.ImageField()
    class Meta:
        model = Images
        fields = ('imageID', 'title', 'imageURL')

class ImageDetailSerializer(serializers.ModelSerializer):
    imageURL = serializers.ImageField()
    class Meta:
        model = Images
        fields = ('imageID', 'userID', 'title', 'createDate', 'viewCount',
                  'imageURL')

class ImageCreateSerializer(serializers.ModelSerializer):
    imageURL = serializers.ImageField()
    class Meta:
        model = Images
        fields = ('userID', 'title','imageURL')
        read_only_fields = ('userid',)  # userid body에서 입력 제외
