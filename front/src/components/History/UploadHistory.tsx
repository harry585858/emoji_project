import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { ImageGrid, StyledImageCard, DeleteButton, EmptyState, Pagination, PageButton } from './HistoryStyles';

const UploadHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  const getPageGroup = (current: number, total: number) => {
    const groupSize = 5;
    const currentGroup = Math.floor((current - 1) / groupSize);
    const start = currentGroup * groupSize + 1;
    const end = Math.min(start + groupSize - 1, total);
    return { start, end };
  };

  const fetchHistory = async (page: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${config.apiurl}image/history/uploaded/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: page,
          size: itemsPerPage
        }
      });
      
      const totalItems = response.data.items ? response.data.items.length : 0;
      setHistory(response.data.items || []);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('업로드 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${config.apiurl}image/history/uploaded/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchHistory(currentPage);
    } catch (error) {
      console.error('업로드 기록 삭제 실패:', error);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  if (loading) return <div>로딩중...</div>;

  if (history.length === 0) {
    return (
      <EmptyState>
        업로드한 이미지가 없습니다.
      </EmptyState>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = history.slice(startIndex, endIndex);

  const { start, end } = getPageGroup(currentPage, totalPages);

  return (
    <div>
      <ImageGrid>
        {currentPageItems.map((item) => (
          <StyledImageCard key={item.imageID}>
            <img src={item.imageURL} alt={item.title} />
            <DeleteButton onClick={() => handleDelete(item.imageID)}>×</DeleteButton>
          </StyledImageCard>
        ))}
      </ImageGrid>
      {totalPages > 1 && (
        <Pagination>
          <PageButton 
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {'<<'}
          </PageButton>
          <PageButton 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            {'<'}
          </PageButton>
          {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
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
            {'>'}
          </PageButton>
          <PageButton 
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {'>>'}
          </PageButton>
        </Pagination>
      )}
    </div>
  );
};

export default UploadHistory; 