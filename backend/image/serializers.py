from rest_framework import serializers
from .models import Images


class ImageSimpleSerializer(serializers.ModelSerializer):
    imageurl = serializers.ImageField()
    class Meta:
        model = Images
        fields = ('imageid', 'title', 'imageurl')

class ImageDetailSerializer(serializers.ModelSerializer):
    imageurl = serializers.ImageField()
    class Meta:
        model = Images
        fields = ('imageid', 'userid', 'title', 'createdate', 'viewcount',
                  'imageurl')

class ImageCreateSerializer(serializers.ModelSerializer):
    imageurl = serializers.ImageField()
    class Meta:
        model = Images
        fields = ('userid', 'title','imageurl')
