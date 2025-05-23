import time

from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_list_or_404
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView

from .models import Images, Historys, Favoriteimages
from .serializers import ImageSimpleSerializer,ImageDetailSerializer,ImageCreateSerializer

#이미지들에 대한 기능 - 전체조회
class ImagesAPIView(APIView):
    #image list retrive
    def get(self, request):
        images = Images.objects.all()
        serializer = ImageSimpleSerializer(images,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

#이미지 하나에 대한 기능 - 상세조회
class ImageAPIView(APIView):
    #detail image
    def get(self, request, pk):
        image = get_object_or_404(Images, imageID=pk)

        #viewCount increase
        image.viewCount += 1
        image.save(update_fields=["viewCount"])

        # 로그인된 유저이면 시청기록 추가
        if request.user.is_authenticated:
            history, created = Historys.objects.get_or_create(
                userID=request.user,
                imageID=image,
            )
            # 기존 기록의 createDate를 현재 시간으로 갱신
            if not created:
                history.watchDate = timezone.now()
                history.save()

        serializer = ImageDetailSerializer(image)
        return Response(serializer.data, status=status.HTTP_200_OK)

#제목으로 조회한 이미지들
class ImagesByTitleAPIView(APIView):
    #retrieve by title
    def get(self, request, title):
        images = get_list_or_404(Images,title__istartswith=title)
        serializer = ImageSimpleSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

#로그인 인증이 필요한 기능 - 업로드 / 수정 / 삭제
class ImageAuthAPIView(APIView):
    permission_classes = [IsAuthenticated]
    # image create
    def post(self, request):
        serializer = ImageCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userID=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # modify image
    def put(self, request, pk):
        image = get_object_or_404(Images, imageID=pk)
        serializer = ImageCreateSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save(userID=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # delete image
    def delete(self, request, pk):
        image = get_object_or_404(Images, imageID=pk)
        if image.userID != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        #s3 삭제
        if image.imageURL:
            image.imageURL.delete(save=False)
        #DB 삭제
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#즐겨찾기 기능 - 조회/추가/삭제
class FavoriteAPIView(APIView):
    permission_classes = [IsAuthenticated]
    #즐겨찾기 조회
    def get(self,request):
        favorites = get_list_or_404(Favoriteimages,userID=request.user)
        images = get_list_or_404(Images,imageURL__in=favorites.imageURL)
        serializer = ImageSimpleSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    #즐겨찾기에 추가
    def post(self, request):
        image = get_object_or_404(Images, imageID=request.data.get('imageID'))
        Favoriteimages.objects.create(userID=request.user, imageID=image)
        return Response({"usrID":request.user.id, "imageID":image.imageID},status=status.HTTP_201_CREATED)
    #즐겨찾기 삭제
    def delete(self,request, imageID):
        favorite = get_object_or_404(Favoriteimages, imageID=imageID, userID=request.user)
        if favorite.userID == request.user:
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
