import { useState, useEffect } from 'react';
import '../assets/App.css';
import Emoji from './Emoji';  // Emoji 컴포넌트
import config from '../config';
// 첫 화면 내부 이미지 모음
interface ImageItem {
  imageID: number;
  title: string;
  imageURL: string;
}
function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  // 서버에서 이미지 데이터 가져오기 (예: API 호출)
  useEffect(() => {
    fetch(`${config.apiurl}image`)  // 실제 이미지 API URL로 변경
      .then(response => response.json())
      .then(data => setImages(data))  // 서버에서 받은 이미지 데이터 상태에 저장
      .catch(error => console.error('이미지 로드 실패:', error));
  }, []);

  return (
    <>
    <br></br>
        <h1>이모티콘</h1>
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
    </>
  );
}

export default App;
