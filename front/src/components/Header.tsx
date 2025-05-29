import { useState, useEffect, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/Header.css';
import config from '../config';
<<<<<<< Updated upstream
// 쿠키에서 특정 key (예: userID) 값을 찾는 함수
=======
import logo from '/src/assets/logo.webp'
import axios from 'axios';

interface ImageItem {
  imageID: number;
  title: string;
  imageURL: string;
  is_favorite: boolean;
}

// 쿠키에서 특정 key
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const [images, setImages] = useState<string[]>([]);
  const location = useLocation(); // 현재 경로 정보 가져오기

  useEffect(() => {
    // userID 쿠키 확인하여 로그인 상태 설정
    const userID = getCookie('userID');
    if (userID) {
      setLogin(true); // 쿠키에 userID가 있으면 로그인 상태로 설정
    }

    // 더미 이미지 데이터 설정
    const dummyImages: string[] = Array.from({ length: 5 }, (_, i) =>
      `https://via.placeholder.com/150?text=Image${i + 1}`
    );
    setImages(dummyImages);
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

  function extractImageID(url: string) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1]; // "12345.jpg"
    const id = filename.split('.')[0]; // "12345"
    return id;
  }

  // 현재 경로가 '/'일 때만 이미지 표시
  const isHomePage = location.pathname === '/';

  return (
    <>
      <div id="header">
        <img alt="logo" onClick={() => { window.location.href = '/'; }} />

=======
  const location = useLocation();

  useEffect(() => {
    const userID = getCookie('userID');
    if (userID) {
      setLogin(true);
    }
  }, []);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() === '') {
      window.location.href = '/';
      return;
    }
    try {
      const response = await axios.get<ImageItem[]>(`${config.apiurl}image/title/${search.trim()}`);
      // 검색 결과 처리는 추후 구현
      console.log('검색 결과:', response.data);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <div id="header">
      <img alt="😄😁" src={logo} onClick={() => { window.location.href = '/'; }} />
      {isHomePage ? (
>>>>>>> Stashed changes
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="검색어 입력"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
<<<<<<< Updated upstream

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
          {images.map((url, idx) => {
            const imageID = extractImageID(url);
            return (
              <div className="imgbox" key={idx}>
                <a href={`/detail?imageID=${imageID}`}>
                  <img src={url} alt={`result-${idx}`} />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </>
=======
      ) : null}
      {login ? (
        <div>
          <button className="headerbtn" onClick={() => { window.location.href = '/upload'; }}>
            업로드
          </button>
          <button className="headerbtn" onClick={() => { window.location.href = '/mypage'; }}>
            마이페이지
          </button>
        </div>
      ) : (
        <button className="headerbtn" onClick={() => { window.location.href = '/account/login'; }}>
          로그인
        </button>
      )}
    </div>
>>>>>>> Stashed changes
  );
}

export default Header;