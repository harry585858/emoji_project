from django.urls import path
from .views import signup, login,delete
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', signup, name='signup'),  # 회원가입
    path('delete/', delete, name='delete'),  #회원탈퇴
    path('login/', TokenObtainPairView.as_view(), name='login'),  # 로그인(JWT 토큰발급)
    path('api/token/refresh/', TokenRefreshView.as_view()),  # 토큰 갱신
]