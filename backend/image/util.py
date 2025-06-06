import cv2
import requests
import numpy as np
from tensorflow.keras.models import load_model
from django.conf import settings
import boto3
import random

def list_ads_image_urls():
    # S3 이미지 URL 광고 이미지 받아 오는 코드 함수 형태로 추가
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    # Ads 폴더의 모든 오브젝트(key) 리스트 가져오기
    response = s3.list_objects_v2(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Prefix='ads/' #S3/ads
    )

    #이미지를 업로드 -> s3 -> 업로드 결과 url (지정된)-> DB RDS에 저장 -> 불러올때도 DB ->

    urls = [] #url 저장 리스트
    if 'Contents' in response:
        for obj in response['Contents']:
            key = obj['Key'] #ads/adImage.jpg
            # 폴더 자체가 아닌 파일만 필터링
            if not key.endswith('/'):
                # RDS 에서 꺼내오는걸로
                url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{key}"
                urls.append(url)
    return urls

def insert_ads_randomly(images, ad):
    insert_pos = random.randint(0, len(images))
    # 광고 하나를 images 리스트 중간에 삽입
    return images[:insert_pos] + [ad] + images[insert_pos:]


def makeTag_from_file(image):
    classes = ['Happiness', 'Fear', 'Sadness', 'Surprised']

    # EC2 모델 경로
    MODEL_PATH = "/usr/src/app/tagging_model_from_csv_128.h5"
    model = load_model(MODEL_PATH)

    file_bytes = np.asarray(bytearray(image.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img_resized = cv2.resize(img, (150, 150))
    img_normalized = img_resized / 255.0
    input_tensor = np.expand_dims(img_normalized, axis=0)

    pred = model.predict(input_tensor)[0]

    top_n = 4
    top_indices = pred.argsort()[-top_n:][::-1]

    tag_indices = pred.argsort()[-2:][::-1]
    Tag = [classes[i] for i in tag_indices]

    for i in top_indices:
        tag = classes[i]
        prob = pred[i] * 100
        print(f"{tag}: {prob:.2f}%")
    print(Tag)

    top_tag = classes[top_indices[0]]
    return Tag


# 이미지 로딩 함수 (URL 또는 로컬 경로 모두 지원)
def load_image(image_path):
    if image_path.startswith("http://") or image_path.startswith("https://"):
        response = requests.get(image_path)
        if response.status_code != 200:
            raise FileNotFoundError(f"이미지를 불러올 수 없습니다: {image_path}")
        img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    else:
        img = cv2.imread(image_path)
        if img is None:
            raise FileNotFoundError(f"이미지를 찾을 수 없습니다: {image_path}")
    return img


# 이미지 텍스트 변환 함수
def image_to_braille(image_path, threshold=128):
    img = load_image(image_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    thresh = cv2.adaptiveThreshold(
        blurred, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        11, 2
    )

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    morphed = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

    morphed = cv2.resize(morphed, None, fx=0.4, fy=0.4, interpolation=cv2.INTER_AREA)  # x, y 비율 조정

    _, binary = cv2.threshold(morphed, threshold, 255, cv2.THRESH_BINARY_INV)

    h, w = binary.shape
    new_h = h + (4 - h % 4) if h % 4 != 0 else h
    new_w = w + (2 - w % 2) if w % 2 != 0 else w
    binary = cv2.copyMakeBorder(binary, 0, new_h - h, 0, new_w - w, cv2.BORDER_CONSTANT, value=0)

    braille_art = ""
    for y in range(0, new_h, 4):
        line = ""
        for x in range(0, new_w, 2):
            dots = 0
            for dy in range(4):
                for dx in range(2):
                    if binary[y + dy, x + dx]:
                        index = dy * 2 + dx
                        dots |= 1 << index
            braille_char = chr(0x2800 + dots)
            line += braille_char
        braille_art += line + "\n"

    return braille_art
