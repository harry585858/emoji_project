import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import '../assets/Uploadbox.css';

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const lastPart = parts.pop();
    if (lastPart) {
      return lastPart.split(';')[0]; // 또는 .shift() 대신 [0]
    }
  }
  return undefined;
}
function Uploadbox() {
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

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

  // 태그 입력 처리
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 업로드 처리
  const handleUpload = () => {
    if (!file || !title) {
      alert('제목과 이미지를 모두 입력해주세요.');
      return;
    }
    const formData = new FormData();
    if (getCookie("userID") !== undefined) {
  formData.append('userID', getCookie("userID")?? '');
}
    formData.append('title', title);
    formData.append('imageURL', file);
    formData.append('tags', JSON.stringify(tags)); // 태그를 JSON 문자열로 전송
    const token = localStorage.getItem('access_token');
    axios
      .post(`${config.apiurl}image/add/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: false,
      })
      .then(res => {
        console.log('업로드 성공:', res.data);
        alert('업로드 성공!');
        setTitle('');
        setPreview(null);
        setFile(null);
        setTags([]);
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

      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          placeholder="태그를 입력하고 Space 또는 Enter"
          style={{ width: '100%', padding: '5px' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px', gap: '5px' }}>
          {tags.map((t, idx) => (
            <span key={idx} style={{ background: '#eee', padding: '5px', borderRadius: '4px' }}>
              {t}
              <button
                onClick={() => handleTagRemove(idx)}
                style={{ marginLeft: '5px', cursor: 'pointer', color: 'red', border: 'none', background: 'transparent' }}
              >
                ✖
              </button>
            </span>
          ))}
        </div>
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
