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

#이미지들에 대한 기능 - 전체조회 최신순
class ImagesAPIView(APIView):
    #image list retrive
    def get(self, request):
        images = Images.objects.all().order_by('-createDate')
        serializer = ImageSimpleSerializer(images,many=True,context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

#전체조회 - 조회수 기준
class ImagesViewCountAPIView(APIView):
    #image list retrive
    def get(self, request):
        images = Images.objects.all().order_by('-viewCount')
        serializer = ImageSimpleSerializer(images,many=True,context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

#이미지 하나에 대한 기능 - 상세조회
class ImageAPIView(APIView):
    #detail image
    def get(self, request, imageID):
        image = get_object_or_404(Images, imageID=imageID)

        #viewCount increase
        image.viewCount += 1
        image.save(update_fields=["viewCount"])

        # 로그인된 유저이면 시청기록 추가
        if request.user.is_authenticated:
            print('확인')
            history, created = Historys.objects.get_or_create(userID=request.user, imageID=image)

            # 기존 기록의 createDate를 현재 시간으로 갱신
            if not created:
                history.watchDate = timezone.now()
                history.save()


        serializer = ImageDetailSerializer(image,context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

#제목으로 조회한 이미지들
class ImagesByTitleAPIView(APIView):
    #retrieve by title
    def get(self, request, title):
        images = get_list_or_404(Images,title__istartswith=title)
        serializer = ImageSimpleSerializer(images, many=True,context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

#내가 올린 이미지 조회
class MyImagesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        images = Images.objects.filter(userID=request.user).order_by('-createDate')
        serializer = ImageSimpleSerializer(images, many=True,context={'request': request})
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
    def put(self, request, imageID):
        image = get_object_or_404(Images, imageID=imageID)
        serializer = ImageCreateSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save(userID=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # delete image
    def delete(self, request, imageID):
        image = get_object_or_404(Images, imageID=imageID)
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
        favorites = Favoriteimages.objects.filter(userID=request.user).order_by('-createDate').select_related('imageID')
        images = [f.imageID for f in favorites]
        serializer = ImageSimpleSerializer(images, many=True,context={'request': request})
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

#시청기록 기능 - 조회/삭제
class HistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]
    #시청기록 조회
    def get(self,request):
        history = Historys.objects.filter(userID=request.user).order_by('-watchDate').select_related('imageID')
        images = [h.imageID for h in history]
        serializer = ImageSimpleSerializer(images, many=True,context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    #시청기록 삭제
    def delete(self,request, imageID):
        history = get_object_or_404(Historys, imageID=imageID, userID=request.user)
        if history.userID == request.user:
            history.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
