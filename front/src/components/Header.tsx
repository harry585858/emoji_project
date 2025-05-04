import { useState, useEffect, FormEvent } from 'react';
import '../assets/Header.css';

function Header() {
  const [login, setLogin] = useState(false);
  const [search, setSearch] = useState('');
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {//dummy
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
  function extractImageID(url:string) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1]; // "12345.jpg"
    const id = filename.split('.')[0]; // "12345"
    return id;
  }
  
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
  {images.map((url, idx) => {
    const imageID = extractImageID(url); // URL에서 ID 추출 함수 필요
    return (
      <div className='imgbox'>
      <a key={idx} href={`/detail?imageID=${imageID}`}>
        <img src={url} alt={`result-${idx}`} />
      </a>
      </div>
    );
  })}
</div>

    </>
  );
}

export default Header;
