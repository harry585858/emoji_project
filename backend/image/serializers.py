from rest_framework import serializers
from .models import Images

class ImageSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ('imageID', 'title', 'imageURL')

class ImageDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ('imageID', 'userID', 'title', 'createDate', 'viewCount',
                  'imageURL')

class ImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ('userID', 'title','imageURL')
