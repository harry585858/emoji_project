import { useState } from 'react';
import '../assets/Header.css';

function Header() {
  const [login, setLogin] = useState(false);
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (search.trim() === '') {
      // 입력 없으면 메인으로 리디렉션
      window.location.href = '/';
      return;
    }

    try {
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: search }),
      });

      const data = await response.json();
      setImages(data.images); // 서버는 { images: [...] } 형식 반환 가정
    } catch (err) {
      console.error('검색 요청 실패:', err);
    }
  };

  return (
    <>
      <div id="header">
        <img alt="logo" onClick={() => { window.location.href = '/'; }} />

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

      {/* 검색 결과 이미지 출력 */}
      <div className="image-results">
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`result-${idx}`} />
        ))}
      </div>
    </>
  );
}

export default Header;
