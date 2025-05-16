from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_list_or_404
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView

from .models import Images
from .serializers import ImageSimpleSerializer,ImageDetailSerializer,ImageCreateSerializer

#이미지들에 대한 기능 - 전체조회 / 업로드
class ImagesAPIView(APIView):
    #image list retrive
    permission_classes = [IsAuthenticated]  # 로그인 필수로
    def get(self, request):
        images = Images.objects.all()
        serializer = ImageSimpleSerializer(images,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    #image create
    def post(self, request):
        serializer = ImageCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#이미지 하나에 대한 기능 - 상세조회 / 삭제 / 수정
class ImageAPIView(APIView):
    #detail image
    def get(self, request, pk):
        image = get_object_or_404(Images, imageID=pk)
        #viewCount increase
        image.viewCount += 1
        image.save(update_fields=["viewCount"])
        serializer = ImageDetailSerializer(image)
        return Response(serializer.data, status=status.HTTP_200_OK)
    #modify image
    def put(self, request, pk):
        image = get_object_or_404(Images, imageID=pk)
        serializer = ImageCreateSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # delete image
    def delete(self, request, pk):
        image = get_object_or_404(Images, imageID=pk)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#제목으로 조회한 이미지들
class ImagesByTitleAPIView(APIView):
    #retrieve by title
    def get(self, request, title):
        images = get_list_or_404(Images,title__icontains=title)
        serializer = ImageSimpleSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)