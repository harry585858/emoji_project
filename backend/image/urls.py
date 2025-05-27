from django.urls import path, include
from .views import ImagesAPIView, ImageAPIView, ImagesByTitleAPIView, ImageAuthAPIView, FavoriteAPIView, HistoryAPIView, \
    MyImagesAPIView, ImagesViewCountAPIView, TagAPIView, TextChangeAPIView

urlpatterns = [
    #이미지들에 대한 기능 - 전체조회
    path('', ImagesAPIView.as_view()), #전체조회
    #전체조회 - 조회수 정렬
    path('orderByViewCount/', ImagesViewCountAPIView.as_view()), #전체조회
    #이미지 하나에 대한 기능 - 상세조회
    path('detail/<int:imageID>/', ImageAPIView.as_view()),#상세조회
    #제목으로 조회한 이미지들
    path('title/<str:title>/',ImagesByTitleAPIView().as_view()), #제목으로 조회
    #내가 올린 이미지
    path('myimage/',MyImagesAPIView().as_view()),
    #로그인 인증이 필요한 기능 - 업로드 / 수정 / 삭제
    path('add/',ImageAuthAPIView().as_view()), #업로드
    path('modify/<int:imageID>',ImageAuthAPIView().as_view()), #수정
    path('del/<int:imageID>',ImageAuthAPIView().as_view()), #삭제
    #즐겨찾기 기능 - 조회 / 추가 / 삭제
    path('favorite/',FavoriteAPIView().as_view()), #조회
    path('favorite/add/',FavoriteAPIView().as_view()), #추가
    path('favorite/del/<int:imageID>',FavoriteAPIView().as_view()), #삭제
    #시청기록 기능 - 조회 / 삭제
    path('history/', HistoryAPIView().as_view()),  # 조회
    path('history/del/<int:imageID>', HistoryAPIView().as_view()),  # 삭제
    #추가 기능 - 태그자동생성 / 도트변환
    path('tag/', TagAPIView().as_view()),  # 조회
    path('textChange/<int:imageID>', TextChangeAPIView().as_view()),  # 삭제
]

