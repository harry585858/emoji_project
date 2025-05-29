import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/App.css';
<<<<<<< Updated upstream
import Emoji from './Emoji';  // Emoji 컴포넌트
=======
import config from '../config';
import axios from 'axios';
import testImage from '../assets/test.png';

// 이미지 데이터 인터페이스
interface ImageItem {
  imageID: number;
  title: string;
  imageURL: string;
}

// 쿠키 가져오기 함수
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};
>>>>>>> Stashed changes

// 첫 화면 내부 이미지 모음
function App() {
  const [images, setImages] = useState([]);

<<<<<<< Updated upstream
  // 서버에서 이미지 데이터 가져오기 (예: API 호출)
=======
  // 테스트용 이미지 데이터 설정
  useEffect(() => {
    // Header.tsx에서 이미지를 로드하지 않도록 주석 처리
    const testData: ImageItem[] = Array(4).fill(null).map((_, index) => ({
      imageID: index + 1,
      title: `테스트 이미지 ${index + 1}`,
      imageURL: testImage
    }));
    setImages(testData);
  }, []);

  // 로그인 상태 확인
>>>>>>> Stashed changes
  useEffect(() => {
    fetch('https://api.com/main')  // 실제 이미지 API URL로 변경
      .then(response => response.json())
      .then(data => setImages(data))  // 서버에서 받은 이미지 데이터 상태에 저장
      .catch(error => console.error('이미지 로드 실패:', error));
  }, []);

<<<<<<< Updated upstream
  return (
    <>
      <div id="main">
        <h1>이모티콘</h1>
        <ul className="image-grid">
          {/* 서버에서 받아온 이미지를 Emoji 컴포넌트를 통해 격자에 표시 */}
          {images.map((image, index) => (
            <Emoji key={index} src={image.url} alt={image.alt} />
          ))}
        </ul>
=======
  // 로그인 상태일 때 추천 이미지 불러오기
  useEffect(() => {
    if (login) {
      const token = localStorage.getItem('access_token');
      axios
        .get(`${config.apiurl}image/history/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: false,
        })
        .then(res => {
          setrecImages(res.data);
        })
        .catch(err => console.error('추천 이미지 로드 실패:', err));
    }
  }, [login]);

  return (
    <>
      <br />
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>테스트 이미지 목록</h2>
      <div className="image-results">
        {images.map((item: ImageItem) => (
          <div className="imgbox" key={item.imageID}>
            <Link to={`/detail/${item.imageID}`}>
              <img src={item.imageURL} alt={item.title} style={{ width: '200px', height: '200px' }} />
              <p>{item.title}</p>
            </Link>
          </div>
        ))}
>>>>>>> Stashed changes
      </div>
    </>
  );
}

export default App;
