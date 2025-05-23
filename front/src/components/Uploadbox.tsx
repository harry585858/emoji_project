import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import '../assets/Uploadbox.css';
function Uploadbox() {
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  // 파일 드롭 처리
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    const previewURL = URL.createObjectURL(droppedFile);
    setPreview(previewURL);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 전송 버튼 클릭 시
  const handleUpload = () => {
    if (!file || !title) {
      alert('제목과 이미지를 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('imageURL', file);
    formData.append('title', title);
    const token = localStorage.getItem('access_token');
    axios
      .post(`${config.apiurl}image/add/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: false,
      })
      .then(res => {
        console.log('업로드 성공:', res.data);
        alert('업로드 성공!');
        // 초기화
        setTitle('');
        setPreview(null);
        setFile(null);
      })
      .catch(err => {
        console.error('업로드 실패:', err);
        alert('업로드 실패');
      });
  };

  return (
    <div className='uploadbox'>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '10px', display: 'block', width: '100%' }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          padding: '50px',
          textAlign: 'center',
          marginTop: '10px'
        }}
      >
        <p>이미지를 여기로 드래그 앤 드롭하세요</p>
        {preview && <img src={preview} alt="preview" style={{ width: '200px', marginTop: '10px' }} />}
      </div>
      <button
        onClick={handleUpload}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        전송
      </button>
    </div>
  );
}

export default Uploadbox;