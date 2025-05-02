import { useState, useEffect } from 'react';
import '../assets/App.css';
import Emoji from './Emoji';  // Emoji 컴포넌트

// 첫 화면 내부 이미지 모음
function App() {
  const [images, setImages] = useState([]);

  // 서버에서 이미지 데이터 가져오기 (예: API 호출)
  useEffect(() => {
    fetch('https://api.com/main')  // 실제 이미지 API URL로 변경
      .then(response => response.json())
      .then(data => setImages(data))  // 서버에서 받은 이미지 데이터 상태에 저장
      .catch(error => console.error('이미지 로드 실패:', error));
  }, []);

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
      </div>
    </>
  );
}

export default App;
