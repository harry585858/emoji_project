import React, { useEffect, useState } from 'react';
import '../assets/Imagebox.css';
import config from '../config';
import axios from 'axios';

interface ImageData {
  imageID: number;
  title: string;
  imageURL: string;
  userID: {
    username: string;
  };
  createDate: string;
  viewCount: number;
  is_favorite: boolean;
  extractedText?: string;
}

interface ImageBoxProps {
  isOriginal?: boolean;
  imageId?: number;
}

const ImageBox: React.FC<ImageBoxProps> = ({ isOriginal = true, imageId }) => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // 텍스트 복사 함수
  const handleCopyText = async () => {
    if (!imageData?.extractedText) return;
    
    try {
      await navigator.clipboard.writeText(imageData.extractedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('텍스트 복사 실패:', err);
      alert('텍스트 복사에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (imageId) {
      const fetchImageData = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get(`${config.apiurl}image/${imageId}/`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          
          if (!isOriginal) {
            // 텍스트 추출 API 호출
            const textResponse = await axios.get(`${config.apiurl}image/textChange/${imageId}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            response.data.extractedText = textResponse.data.text || '변환된 텍스트가 없습니다.';
          }
          
          setImageData(response.data);
        } catch (err) {
          console.error('이미지 데이터 로드 실패:', err);
          setError('이미지를 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchImageData();
    }
  }, [imageId, isOriginal]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!imageData) return <div>이미지를 찾을 수 없습니다.</div>;

  return (
    <div className="image-box">
      {isOriginal && (
        <div className="image-info compact">
          <div className="info-row">
            <span className="info-label">제목:</span>
            <span className="info-value">{imageData.title}</span>
            <span className="info-label" style={{ marginLeft: '20px' }}>작성자:</span>
            <span className="info-value">{imageData.userID.username}</span>
          </div>
        </div>
      )}
      <div className="image-content">
        {isOriginal ? (
          <img
            src={imageData.imageURL}
            alt={imageData.title}
            className="image"
          />
        ) : (
          <div className="extracted-text">
            <button 
              className="copy-button" 
              onClick={handleCopyText}
              disabled={!imageData.extractedText || imageData.extractedText === '변환된 텍스트가 없습니다.'}
            >
              {copySuccess ? '복사 완료!' : '텍스트 복사'}
            </button>
            <p>{imageData.extractedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageBox;
