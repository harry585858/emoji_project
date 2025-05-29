import { useState, useEffect } from 'react';
import '../assets/App.css';
import config from '../config';
import axios from 'axios';

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

function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [login, setLogin] = useState(false);

  // 이미지 불러오기
  // useEffect(() => {
  //   fetch(`${config.apiurl}image`)
  //     .then(response => response.json())
  //     .then(data => setImages(data))
  //     .catch(error => console.error('이미지 로드 실패:', error));
  // }, []);

  // 로그인 상태 확인
  useEffect(() => {
    const userID = getCookie('userID');
    if (userID) {
      setLogin(true);
    }
  }, []);

  // 로그인 상태일 때 이미지 불러오기
  useEffect(() => {
    if (login) {
      const token = localStorage.getItem('access_token');
      axios
        .get(`${config.apiurl}image/history/`, {
          headers: {
          Authorization: `Bearer ${token}`,
        },
          withCredentials: false, // 쿠키 인증 필요시
        })
        .then(res => {
          setImages(res.data);
        })
        .catch(err => console.error('추천 이미지 로드 실패:', err));
    }
    else{
      console.error('no return');
      setImages([]);
    }
  }, [login]);

  return (
  <>
    <br />
    {login && <h1>최근 조회한 이미지</h1>}

    <div className="image-results">
      {images.length !== 0 && images.map((item: ImageItem, idx: number) => (
        <div className="imgbox" key={idx}>
          <a href={`/detail?imageID=${item.imageID}`}>
            <img src={item.imageURL} alt={item.title} />
            <p>{item.title}</p>
          </a>
        </div>
      ))}
    </div>
  </>
);
}

export default App;
