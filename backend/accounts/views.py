from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


#데코레이터 DRF
#회원가입
@api_view(['POST'])
def signup(request):
    userID = request.data.get('userID') #유저 아이디
    userPW = request.data.get('userPW') #유저 비밀번호
    if not userID or not userPW:
        return Response({'error': 'ID와 PW를 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=userID).exists():
        return Response({'error': '이미 존재하는 아이디입니다.'}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create_user(username=userID, password=userPW)
    return Response({'message': '회원가입 성공'}, status=status.HTTP_201_CREATED)

#로그인
@api_view(['POST'])
def login(request):
    userID = request.data.get('userID')
    userPW = request.data.get('userPW')

    if not userID or not userPW:
        return Response({'error': 'userID와 userPW는 필수입니다.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=userID, password=userPW)

    if user is not None:
        # 로그인 성공 - 토큰
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': '로그인 성공'
        }, status=status.HTTP_200_OK)
    else:
        # 로그인 실패
        return Response({'error': '아이디/비밀번호가 일치하지 않습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

#회원탈퇴
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete(request):
    # request.user는 현재 인증된 유저 객체
    user = request.user
    user.delete()
    return Response({'message': "회원탈퇴 완료"}, status=status.HTTP_200_OK)