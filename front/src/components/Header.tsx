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

  const toggleLike = (imageID: number): void => {
  const token= localStorage.getItem('access_token');
  if (!token) {
    alert('로그인이 필요합니다.');
    return;
  }

  const imageIndex: number = images.findIndex((img) => img.imageID === imageID);
  if (imageIndex === -1) return;

  const isCurrentlyFavorite: boolean = images[imageIndex].is_favorite;

  if (isCurrentlyFavorite) {
    // ❤️ -> 🤍 좋아요 취소
    axios
      .delete(`${config.apiurl}image/favorite/del/${imageID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const newImages: ImageItem[] = [...images];
        newImages[imageIndex] = {
          ...newImages[imageIndex],
          is_favorite: false,
        };
        setImages(newImages);
      })
      .catch((err: unknown) => {
        console.error('좋아요 취소 실패:', err);
        alert('좋아요 취소에 실패했습니다.');
      });
  } else {
    // 🤍 -> ❤️ 좋아요 등록
    axios
      .post(`${config.apiurl}image/favorite/add/`, {imageID:String(imageID)}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const newImages: ImageItem[] = [...images];
        newImages[imageIndex] = {
          ...newImages[imageIndex],
          is_favorite: true,
        };
        setImages(newImages);
      })
      .catch((err: unknown) => {
        console.error('좋아요 등록 실패:', err);
        alert('좋아요 등록에 실패했습니다.');
      });
  }
};
  useEffect(() => {
  const userID = getCookie('userID');
  const token= localStorage.getItem('access_token');
  if (userID) {
    setLogin(true);
  }
  axios.get(`${config.apiurl}image/?page=${page}&sort=Default`,{
    headers: {
          Authorization: `Bearer ${token}`,
        },
  })
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
function resetPage(input: number) {
  setPage(input);
  
  axios.get(`${config.apiurl}image/?page=${input}&sort=Default`) // <- page가 아니라 input 사용
    .then(response => {
      const data = response.data;
      if (Array.isArray(data.results)) {
        setImages(data.results);
        console.log('업데이트');
      } else {
        console.error("응답에 results가 없음:", data);
        setImages([]);
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        alert('해당 페이지를 찾을 수 없습니다.');
      } else {
        console.error('요청 실패:', error);
      }
    });
}
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
        <a href={`/detail/${item.imageID}`}>
          <img src={item.imageURL} alt={item.title} />
          <p>{item.title}</p>        </a>
          <p onClick={()=> toggleLike(item.imageID)}>{item.is_favorite ? `❤️`:`🤍`}</p>

      </div>
    ))}
  </div>
)}
{isHomePage &&
(<div>
    <button className='pagebtn' onClick={()=>resetPage(page > 1 ? page-1:1)}> {page-1}</button>
    <button> {page}</button>
    <button className='pagebtn' onClick={()=>resetPage(page+1)}>{page+1}</button>
  </div>
)}
    </>
  );
}

export default Header;