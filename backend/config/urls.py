"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from accounts.views import signup, delete
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/signup/', signup, name='signup'),  # 회원가입
    path('account/delete/', delete, name='delete'),  #회원탈퇴
    path('account/login/', TokenObtainPairView.as_view(), name='login'),  # 로그인(JWT 토큰발급)
    path('api/token/refresh/', TokenRefreshView.as_view()),  # 토큰 갱신
    path('image/', include('image.urls')),
]
