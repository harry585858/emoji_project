import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import '../assets/Tagbox.css';

interface TagBoxProps {
  imageId: number;
}

interface Tag {
  tagID: number;
  tagName: string;
  isActive?: boolean;
}

const TagBox = ({ imageId }: TagBoxProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {

        // 실제 API 호출
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${config.apiurl}image/tag/${imageId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        // 태그 데이터 변환
        const processedTags = response.data.map((tag: any) => ({
          tagID: tag.id || tag.tagID,
          tagName: tag.tag,  // 데이터베이스의 tag 컬럼 사용
          isActive: true  // 기본적으로 활성 상태로 표시
        }));
        
        setTags(processedTags);
      } catch (err) {
        console.error('태그 로드 실패:', err);
        setError('태그를 불러오는데 실패했습니다.');
        // 에러 발생 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {  // imageId가 유효할 때만 태그를 가져옴
      fetchTags();
    }
  }, [imageId]);

  const handleTagClick = (tagName: string) => {
    // 태그 검색 페이지로 이동
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="tag-box">
      <div className="tags-container">
        {tags.length > 0 ? (
          tags.map(tag => (
            <span
              key={tag.tagID}
              className={`tag ${tag.isActive ? 'active-tag' : ''}`}
              onClick={() => handleTagClick(tag.tagName)}
            >
              {tag.tagName}
            </span>
          ))
        ) : (
          <div className="empty-tags">태그가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default TagBox;
