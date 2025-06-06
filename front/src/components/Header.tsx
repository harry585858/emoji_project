<<<<<<< HEAD
import { useState, useEffect, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/Header.css';
import config from '../config';
<<<<<<< Updated upstream
// 쿠키에서 특정 key (예: userID) 값을 찾는 함수
=======
import logo from '/src/assets/logo.webp'
=======
import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/Header.css';
import config from '../config';
import logo from '/src/assets/logo.png'
>>>>>>> 0a337f79a9d69e90c832717c10abbcd9bf15c791
import axios from 'axios';

interface ImageItem {
  imageID: number;
  title: string;
  imageURL: string;
  is_favorite: boolean;
}
<<<<<<< HEAD

// 쿠키에서 특정 key
>>>>>>> Stashed changes
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};
=======
interface ImageListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ImageItem[];
}

// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
//   return null;
// };
>>>>>>> 0a337f79a9d69e90c832717c10abbcd9bf15c791

function Header() {
  const [login, setLogin] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
<<<<<<< HEAD
<<<<<<< Updated upstream
  const [images, setImages] = useState<string[]>([]);
  const location = useLocation(); // 현재 경로 정보 가져오기
=======
  const [images, setImages] = useState<ImageItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLDivElement | null>(null);
>>>>>>> 0a337f79a9d69e90c832717c10abbcd9bf15c791

  const isHomePage = location.pathname === '/';

  // 좋아요 토글 함수 (변경 없음)
  const toggleLike = (imageID: number): void => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    const imageIndex: number = images.findIndex((img) => img.imageID === imageID);
    if (imageIndex === -1) return;
    const isCurrentlyFavorite: boolean = images[imageIndex].is_favorite;

    if (isCurrentlyFavorite) {
      axios
        .delete(`${config.apiurl}image/favorite/del/${imageID}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          const newImages: ImageItem[] = [...images];
          newImages[imageIndex] = { ...newImages[imageIndex], is_favorite: false };
          setImages(newImages);
        })
        .catch((err: unknown) => {
          console.error('좋아요 취소 실패:', err);
          alert('좋아요 취소에 실패했습니다.');
        });
    } else {
      axios
        .post(`${config.apiurl}image/favorite/add/`, { imageID: String(imageID) }, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          const newImages: ImageItem[] = [...images];
          newImages[imageIndex] = { ...newImages[imageIndex], is_favorite: true };
          setImages(newImages);
        })
        .catch((err: unknown) => {
          console.error('좋아요 등록 실패:', err);
          alert('좋아요 등록에 실패했습니다.');
        });
    }
  };

  // 이미지 불러오기 함수 (페이지, 검색어)
  const fetchImages = useCallback(async (pageNum: number, searchWord: string = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      let url = '';
      if (searchWord.trim() === '') {
        url = `${config.apiurl}image/?page=${pageNum}&sort=Default`;
      } else {
        url = `${config.apiurl}image/title/${searchWord.trim()}?page=${pageNum}`;
      }
      const response = await axios.get<ImageListResponse>(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = response.data;
      if (Array.isArray(data.results)) {
        setImages(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
        setHasMore(!!data.next);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
      if ((error as any).response && (error as any).response.status === 404) {
        alert('해당 페이지를 찾을 수 없습니다.');
      } else {
        console.error('요청 실패:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 로그인 여부 확인 + 첫 이미지 로딩
  useEffect(() => {
    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('refresh_token');
    if (userID){
      axios.post(`${config.apiurl}accounts/api/token/refresh/`,
        {refresh : token },
        {withCredentials: false}
      )
      .then(
        (res)=>{localStorage.setItem('access_token',res.data.access);}
      )
      setLogin(true);
    }
    setImages([]);
    setPage(1);
    setHasMore(true);
    fetchImages(1, '');
  // eslint-disable-next-line
  }, []);

  // 검색 submit
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImages([]);
    setPage(1);
    setHasMore(true);
    if (search.trim() === '') {
      window.location.href = '/';
      return;
    }
    fetchImages(1, search);
  };

  // 무한 스크롤 Intersection Observer
  useEffect(() => {
    if (!isHomePage || !hasMore || loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (lastImageRef.current) observer.current.observe(lastImageRef.current);
    // eslint-disable-next-line
  }, [images, hasMore, loading, isHomePage]);

  // 페이지가 바뀌면 이미지 추가 로딩
  useEffect(() => {
    if (page === 1) return;
    fetchImages(page, search);
    // eslint-disable-next-line
  }, [page]);

  return (
    <>
      <div id="header">
<<<<<<< HEAD
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

=======
        <img alt="😄😁" src={logo} onClick={() => { window.location.href = '/'; }} />
        {isHomePage ? (
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="검색어 입력"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        ) : null}
>>>>>>> 0a337f79a9d69e90c832717c10abbcd9bf15c791
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
          {images.length !== 0 && images.map((item: ImageItem, idx: number) => {
            // 마지막 이미지에 ref 달기
            const isLast = idx === images.length - 1;
            return (
              <div
                className="imgbox"
                key={item.imageID}
                ref={isLast ? lastImageRef : null}
              >
                <a href={`/detail/${item.imageID}`}>
                  <img src={item.imageURL} alt={item.title} />
                  <p>{item.title}</p>
                </a>
                {login ? (<p onClick={() => toggleLike(item.imageID)}>{item.is_favorite ? `❤️` : `🤍`}</p>):null}
              </div>
            );
          })}
          {loading && <div style={{ textAlign: 'center', padding: 20 }}>로딩 중...</div>}
          {!hasMore && !loading && images.length > 0 && (
            <div style={{ textAlign: 'center', padding: 20 }}>더 이상 이미지가 없습니다.</div>
          )}
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
