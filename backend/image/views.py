from rest_framework.response import Response
from rest_framework import status

from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView

from .models import Images
from .serializers import ImageSimpleSerializer,ImageDetailSerializer,ImageCreateSerializer

#이미지들에 대한 기능 - 전체조회 / 업로드
class ImagesAPIView(APIView):
    #image list retrive
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

#이미지 하나에 대한 기능 - 상세조회 / 수정
class ImageAPIView(APIView):
    #detail image
    def get(self, request, pk):
        Image = get_object_or_404(Images, imageid=pk)
        serializer = ImageDetailSerializer(Image)
        return Response(serializer.data, status=status.HTTP_200_OK)
    #modify image
    def put(self, request, pk):
        Image = get_object_or_404(Images, imageid=pk)
        serializer = ImageCreateSerializer(Image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

