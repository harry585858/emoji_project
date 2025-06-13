import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { ImageGrid, StyledImageCard, DeleteButton, EmptyState, Pagination, PageButton } from './HistoryStyles';

const CreatedHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const fetchHistory = async (page: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${config.apiurl}image/history/created/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: page,
          size: itemsPerPage
        }
      });
      setHistory(response.data.items || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('생성 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${config.apiurl}image/history/created/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchHistory(currentPage);
    } catch (error) {
      console.error('생성 기록 삭제 실패:', error);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  if (loading) return <div>로딩중...</div>;

  if (history.length === 0) {
    return (
      <EmptyState>
        생성한 이미지가 없습니다.
      </EmptyState>
    );
  }

  return (
    <div>
      <ImageGrid>
        {history.map((item) => (
          <StyledImageCard key={item.imageID}>
            <img src={item.imageURL} alt={item.title} />
            <DeleteButton onClick={() => handleDelete(item.imageID)}>×</DeleteButton>
          </StyledImageCard>
        ))}
      </ImageGrid>
      <Pagination>
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PageButton
            key={page}
            isActive={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PageButton>
        ))}
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          다음
        </PageButton>
      </Pagination>
    </div>
  );
};

export default CreatedHistory; 
