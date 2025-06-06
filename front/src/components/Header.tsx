import React, { useState, useEffect, FormEvent } from 'react';
import '../assets/Header.css';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { getCookie } from '../utils/cookie';

interface ImageItem {
  imageID: number;
  title: string;
  imageURL: string;
  viewCount: number;
  createDate: string;
  userID: number;
}

interface ImageListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ImageItem[];
}

// Header 컴포넌트 내에서 로그인 여부 확인
function Header() {
  const [login, setLogin] = useState(false);
  const [search, setSearch] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const location = useLocation();

  useEffect(() => {
    const userID = getCookie('userID');
    if (userID) {
      setLogin(true);
      // 사용자 ID의 첫 글자를 대문자로 설정
      setUserInitial(userID.charAt(0).toUpperCase());
    }

    axios.get(`${config.apiurl}image`)
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
        setImages([]);
      });
  }, []);

  const handleLogout = () => {
    // 로컬 스토리지의 토큰 제거
    localStorage.removeItem('access_token');
    // 쿠키의 userID 제거
    document.cookie = 'userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setLogin(false);
    setShowDropdown(false);
    // 홈페이지로 리다이렉트
    window.location.href = '/';
  };

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

  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          KEEPIC
        </Link>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </form>
      </div>
      <div className="header-right">
        {login ? (
          <>
            <Link to="/Upload" className="upload-button">
              Upload
            </Link>
            <div className="profile-container">
              <button 
                className="profile-button"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="프로필 메뉴"
              >
                <span className="profile-circle">
                  {userInitial || '👤'}
                </span>
              </button>
              {showDropdown && (
                <div className="profile-dropdown">
                  <Link to="/mypage" className="dropdown-item">
                    마이페이지
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/account/login" className="login-button">
              Login
            </Link>
            <Link to="/account/signup" className="signup-button">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
