from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

#데코레이터 DRF
@api_view(['POST'])
def signup(request):
    nickName = request.data.get('nickNmae') # 닉네임
    userID = request.data.get('userID') #유저 아이디
    userPW = request.data.get('userPW') #유저 비밀번호
    if not userID or not userPW:
        return Response({'error': '필수 데이터 없음'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=userID).exists():
        return Response({'error': '이미 존재하는 아이디'}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create_user(username=userID, password=userPW)
    return Response({'message': '회원가입 성공'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(request):
    userID = request.data.get('userID')
    userPW = request.data.get('userPW')
    userID = authenticate(username=userID, userpassword=userPW)
    if user is not None:
        # 로그인 성공 (토큰 대신 단순 성공 메시지)
        return Response({'message': '로그인 성공'}, status=status.HTTP_200_OK)
    else:
        # 로그인 실패
        return Response({'error': '아이디/비밀번호가 일치하지 않습니다.'}, status=status.HTTP_401_UNAUTHORIZED)
