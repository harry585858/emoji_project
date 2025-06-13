import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import '../assets/ImageBox.css';
import testImage from '../assets/test.png';

interface MockData {
  imageID: number;
  title: string;
  username: string;
  imageURL: string;
  extractedText: string;
}

const TestEdit = () => {
  const [mockData, setMockData] = useState<MockData>({
    imageID: 9999,
    title: "테스트 이미지",
    username: "테스트 사용자",
    imageURL: testImage,
    extractedText: ""
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageText = async () => {
      setLoading(true);
      try {
        // 테스트 환경에서는 모의 데이터 사용
        if (mockData.imageID === 9999) {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      } catch (err) {
        setError('텍스트 불러오기 실패');
        setLoading(false);
      }
    };
    fetchImageText();
  }, [mockData.imageID]);

  const handleCopyText = async () => {
    if (!mockData.extractedText) return;
    try {
      await navigator.clipboard.writeText(mockData.extractedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('텍스트 복사 실패:', err);
      alert('텍스트 복사에 실패했습니다.');
    }
  };

  return (
    <div style={{
      width: "100%",
      margin: "0 auto",
      minHeight: "85vh",
      paddingTop: "80px",
      display: "flex",
      flexDirection: "row",
      gap: "30px"
    }}>
      <div style={{ flex: 1, minWidth: "600px", gap: "20px", display: "flex" }}>
        {/* 여기에 ImageBox(들) 추가 가능 */}
      </div>
    </div>
  );
};

export default TestEdit; 