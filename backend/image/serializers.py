from rest_framework import serializers
from .models import Images, Tags, Favoriteimages


class ImageSimpleSerializer(serializers.ModelSerializer):
    imageURL = serializers.ImageField()
    #즐겨찾기 여부
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Images
        fields = ('imageID', 'title', 'imageURL','is_favorite')

    def get_is_favorite(self, obj):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            return Favoriteimages.objects.filter(userID=request.user, imageID=obj).exists()
        return False

class ImageDetailSerializer(serializers.ModelSerializer):
    imageURL = serializers.ImageField()
    #tags는 이미지DB에는 없기 때문에 tagDB에서 가져옴
    tags = serializers.SerializerMethodField()
    # 즐겨찾기 여부
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Images
        fields = ('imageID', 'userID', 'title', 'createDate', 'viewCount',
                  'imageURL','tags','is_favorite')
    # tags 역참조
    def get_tags(self, obj):
        return list(obj.tags_set.values_list('tag', flat=True))

    def get_is_favorite(self, obj):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            return Favoriteimages.objects.filter(userID=request.user, imageID=obj).exists()
        return False

class ImageCreateSerializer(serializers.ModelSerializer):
    imageURL = serializers.ImageField()
    #tags는 이미지DB에는 없기 때문에 list로 따로 선언
    tags = serializers.ListField(
        child=serializers.CharField(max_length=10),
        write_only=True
    )
    class Meta:
        model = Images
        fields = ('userID', 'title','imageURL', 'tags')
        read_only_fields = ('userID',)  # userid body에서 입력 제외
    #tag도 한번에 저장되도록
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        image = Images.objects.create(**validated_data)

        for tag_name in tags_data:
            Tags.objects.create(imageID=image, tag=tag_name)

        return image