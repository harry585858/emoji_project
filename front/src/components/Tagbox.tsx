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
        // 테스트 환경에서는 모의 데이터 사용
        if (imageId === 9999) {
          const mockTags = [
            { tagID: 1, tagName: "귀여움", isActive: true },
            { tagID: 2, tagName: "행복", isActive: true },
            { tagID: 3, tagName: "웃음", isActive: false },
            { tagID: 4, tagName: "테스트", isActive: false }
          ];
          setTags(mockTags);
          setLoading(false);
          return;
        }

        // 실제 API 호출
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${config.apiurl}image/tag/${imageId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        // API 응답에서 활성/비활성 태그 구분
        const processedTags = response.data.map((tag: Tag) => ({
          ...tag,
          isActive: tag.isActive || false
        }));
        
        setTags(processedTags);
      } catch (err) {
        console.error('태그 로드 실패:', err);
        setError('태그를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [imageId]);

  const handleTagClick = (tagName: string) => {
    // 태그 검색 페이지로 이동
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  // 태그를 활성/비활성 상태로 정렬
  const sortedTags = [...tags].sort((a, b) => {
    if (a.isActive === b.isActive) {
      return a.tagName.localeCompare(b.tagName);
    }
    return a.isActive ? -1 : 1;
  });

  return (
    <div className="tag-box">
      <div className="tags-container">
        {sortedTags.length > 0 ? (
          sortedTags.map(tag => (
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
