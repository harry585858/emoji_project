import { useState, useEffect, FormEvent } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation 훅 임포트
import '../assets/Header.css';
import config from '../config';
import logo from '/src/assets/logo.webp'
import axios from 'axios';
interface ImageItem {
  imageID: number;
  title: string;
  imageURL: string;
}
// 쿠키에서 특정 key
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Header 컴포넌트 내에서 로그인 여부 확인
function Header() {
  const [login, setLogin] = useState(false);
  const [search, setSearch] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const location = useLocation(); // 현재 경로 정보 가져오기
  useEffect(() => {
    // userID 쿠키 확인하여 로그인 상태 설정
    const userID = getCookie('userID');
    if (userID) {
      setLogin(true); // 쿠키에 userID가 있으면 로그인 상태로 설정
    }

    // 더미 이미지 데이터 설정
    /*const dummyImages: string[] = Array.from({ length: 5 }, (_, i) =>
      `https://via.placeholder.com/150?text=Image${i + 1}`
    `${config.apiurl}image`
    );
    setImages(dummyImages);
    */
   
axios.get<ImageItem[]>(`${config.apiurl}image`)  // <-- API URL
  .then(response => {
    setImages(response.data);
  })
  .catch(error => {
    console.error('에러 발생:', error);
  });
  }, []);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search.trim() === '') {
      // 입력 없으면 메인으로 리디렉션
      window.location.href = '/';
      return;
    }

    try {
      const response = await fetch(`${config.apiurl}search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag: search }),
      });

      const data = await response.json();
      setImages(data.images); // 서버는 { images: [...] } 형식 반환 가정
    } catch (err) {
      console.error('검색 요청 실패:', err);
    }
  };

  // 현재 경로가 '/'일 때만 이미지 표시
  const isHomePage = location.pathname === '/';

  return (
    <>
      <div id="header">
        <img alt="😄😁" src={logo} onClick={() => { window.location.href = '/'; }} />

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="검색어 입력"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {login ? (
          <button id="headerbtn" onClick={() => { window.location.href = '/mypage'; }}>
            마이페이지
          </button>
        ) : (
          <button id="headerbtn" onClick={() => { window.location.href = '/account/login'; }}>
            로그인
          </button>
        )}
      </div>

      {/* 현재 경로가 '/'일 때만 이미지 출력 */}
      {isHomePage && (
  <div className="image-results">
    {images.map((item: ImageItem, idx: number) => (
      <div className="imgbox" key={idx}>
        <a href={`/detail?imageID=${item.imageID}`}>
          <img src={item.imageURL} alt={item.title} />
          <p>{item.title}</p>
        </a>
      </div>
    ))}
  </div>
)}
    </>
  );
}

export default Header;