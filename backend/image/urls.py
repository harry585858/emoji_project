from django.urls import path, include
from .views import ImagesAPIView, ImageAPIView, ImagesByTitleAPIView, ImageAuthAPIView, FavoriteAPIView

urlpatterns = [
    #이미지들에 대한 기능 - 전체조회
    path('', ImagesAPIView.as_view()), #전체조회
    #이미지 하나에 대한 기능 - 상세조회
    path('detail/<int:pk>/', ImageAPIView.as_view()),#상세조회
    #제목으로 조회한 이미지들
    path('title/<str:title>/',ImagesByTitleAPIView().as_view()), #제목으로 조회
    #로그인 인증이 필요한 기능 - 업로드 / 수정 / 삭제
    path('add/',ImageAuthAPIView().as_view()), #업로드
    path('modify/<int:pk>',ImageAuthAPIView().as_view()), #수정
    path('del/<int:pk>',ImageAuthAPIView().as_view()), #삭제
    #즐겨찾기 기능 - 조회 / 추가 / 삭제
    path('favorite/',FavoriteAPIView().as_view()), #조회
    path('favorite/add/',FavoriteAPIView().as_view()), #추가
    path('favorite/del/<int:pk>',FavoriteAPIView().as_view()), #삭제
]

