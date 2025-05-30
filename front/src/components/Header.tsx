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
  is_favorite:boolean;
}
interface ImageListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ImageItem[];
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const location = useLocation(); // 현재 경로 정보 가져오기
  useEffect(() => {
  const userID = getCookie('userID');
  if (userID) {
    setLogin(true);
  }

  axios.get(`${config.apiurl}image/?page=${page}&sort=Default`)
    .then(response => {
      const data = response.data;
      if (Array.isArray(data.results)) {
      setImages(data.results);
    } else {
      console.error("응답에 results가 없음:", data);
      setImages([]);
}
    })
    .catch(error => {
      console.error('에러 발생:', error);
      setImages([]); // 에러 시에도 빈 배열
    });
}, []);

const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setImages([]);
  if (search.trim() === '') {
    window.location.href = '/';
    return;
  }
  try {
    const response = await axios.get<ImageListResponse>(`${config.apiurl}image/title/${search.trim()}`);
    const data = response.data;
    setImages(data.results);
  } catch (error) {
    console.error('에러 발생:', error);
  }
};

  // 현재 경로가 '/'일 때만 이미지 표시
  const isHomePage = location.pathname === '/';

  return (
    <>
      <div id="header">
        <img alt="😄😁" src={logo} onClick={() => { window.location.href = '/'; }} />
{isHomePage ? (
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="검색어 입력"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>)
:null }
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
      {isHomePage && (
  <div className="image-results">
    {images.length !==0 && images.map((item: ImageItem, idx: number) => (
      <div className="imgbox" key={idx}>
        <a href={`/detail?imageID=${item.imageID}`}>
          <img src={item.imageURL} alt={item.title} />
          <p>{item.title}{item.is_favorite ? `❤️`:`🤍`}</p>
        </a>
      </div>
    ))}
    <button onClick={()=>setPage(page > 1 ? page-1:1)}> {page-1}</button>
    <p>{page}</p>
    <button onClick={()=>setPage(page+1)}>{page+1}</button>
  </div>
)}
    </>
  );
}

export default Header;