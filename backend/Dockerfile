# 베이스 이미지로 Python 3.10.4 사용
FROM python:3.10.4

# 작업 디렉토리 설정 (cd와 유사)
WORKDIR /usr/src/app

# 종속성 설치
COPY requirements.txt /usr/src/app/

# 터미널 안에서 리눅스 명령어 사용하는 것처럼 사용 가능
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Django 애플리케이션이 있는 디렉토리로 이동
WORKDIR /usr/src/app/emoji_project

# 컨테이너 외부에서 접근할 수 있도록 포트 8000 노출
EXPOSE 8000

# Gunicorn을 사용하여 WSGI 서버 실행
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
