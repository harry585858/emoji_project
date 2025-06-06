import { useState, useEffect, useRef } from 'react';
//import { useNavigate, useLocation, Link, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import '../assets/Mypage.css';
import styled from 'styled-components';
import { getCookie } from '../utils/cookie';

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
`;

const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 1.1em;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    background-color: rgba(200, 35, 51, 1);
  }
`;

const StyledImageCard = styled(ImageCard)`
  position: relative;

  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding: 20px 0;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.isActive ? '#007bff' : '#dee2e6'};
  background-color: ${props => props.isActive ? '#007bff' : 'white'};
  color: ${props => props.isActive ? 'white' : '#007bff'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.isActive ? '#0056b3' : '#e9ecef'};
  }

  &:disabled {
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Mypage = () => {
  const [selected, setSelected] = useState('내 정보');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${config.apiurl}accounts/user-info/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (response.status === 200) {
          setUserId(response.data.usrID);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        // 실패 시 쿠키의 값을 폴백으로 사용
        const cookieUserId = getCookie('userID');
        if (cookieUserId) {
          setUserId(cookieUserId);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_image', file);

      axios.post(`${config.apiurl}accounts/upload-profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      .then(response => {
        setProfileImage(response.data.image_url);
        alert('프로필 이미지가 업데이트되었습니다.');
      })
      .catch(error => {
        console.error('프로필 이미지 업로드 실패:', error);
        alert('프로필 이미지 업로드에 실패했습니다.');
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiurl}accounts/change-password/`,
        {
          current_password: currentPassword,
          new_password: newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (response.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await axios.delete(
        `${config.apiurl}accounts/withdraw/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (response.status === 200) {
        alert('회원탈퇴가 완료되었습니다.');
        localStorage.removeItem('access_token');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
    setShowWithdrawModal(false);
  };

  const menuItems = ['내 정보', '즐겨찾기들', '히스토리'];

  const renderContent = () => {
    switch (selected) {
      case '내 정보':
        return (
          <div className="user-info-section">
            <h2>내 프로필</h2>
            
            <div className="profile-section">
              <div className="profile-info">
                <div className="profile-image-container">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="프로필" 
                      className="profile-image" 
                    />
                  ) : (
                    <div className="profile-image">
                      {userId?.charAt(0).toUpperCase() || '👤'}
                    </div>
                  )}
                </div>
                <div className="profile-details">
                  <p className="user-id">{userId}</p>
                  <button 
                    className="profile-upload-button"
                    onClick={handleUploadClick}
                  >
                    프로필 변경
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            <div className="info-divider"></div>

            <h3>비밀번호 변경 및 탈퇴</h3>

            <div className="account-actions">
              <button className="action-button" onClick={() => setShowPasswordModal(true)}>
                비밀번호 변경
              </button>
              <button className="action-button danger" onClick={() => setShowWithdrawModal(true)}>
                회원탈퇴
              </button>
            </div>

            {showPasswordModal && (
              <Modal onClick={() => setShowPasswordModal(false)}>
                <ModalContent onClick={e => e.stopPropagation()}>
                  <h3>비밀번호 변경</h3>
                  <div className="password-change">
                    <input
                      type="password"
                      placeholder="현재 비밀번호"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="새 비밀번호"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="새 비밀번호 확인"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <ModalButtons>
                    <button className="cancel-button" onClick={() => setShowPasswordModal(false)}>
                      취소
                    </button>
                    <button className="confirm-button" onClick={handlePasswordChange}>
                      변경하기
                    </button>
                  </ModalButtons>
                </ModalContent>
              </Modal>
            )}

            {showWithdrawModal && (
              <Modal onClick={() => setShowWithdrawModal(false)}>
                <ModalContent onClick={e => e.stopPropagation()}>
                  <h3>회원탈퇴</h3>
                  <p>정말로 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
                  <ModalButtons>
                    <button className="cancel-button" onClick={() => setShowWithdrawModal(false)}>
                      취소
                    </button>
                    <button className="confirm-button danger" onClick={handleWithdraw}>
                      탈퇴하기
                    </button>
                  </ModalButtons>
                </ModalContent>
              </Modal>
            )}
          </div>
        );

      case '즐겨찾기들':
        return (
          <div className="favorites-container">
            <h2>즐겨찾기한 이모티콘</h2>
            {/* 즐겨찾기 내용 구현 예정 */}
          </div>
        );

      case '히스토리':
        return <History />;

      default:
        return null;
    }
  };

  return (
    <div className="mypage-container">
      <aside className="mypage-sidebar">
        {menuItems.map((item) => (
          <button
            key={item}
            className={`mypage-button ${selected === item ? 'active' : ''}`}
            onClick={() => setSelected(item)}
          >
            {item}
          </button>
        ))}
      </aside>
      <main className="mypage-content">
        {renderContent()}
      </main>
    </div>
  );
};

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

const UploadHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

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
      setHistory(response.data.items || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
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

const ViewHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const fetchHistory = async (page: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${config.apiurl}image/history/viewed/`, {
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
      console.error('조회 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${config.apiurl}image/history/viewed/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchHistory(currentPage);
    } catch (error) {
      console.error('조회 기록 삭제 실패:', error);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  if (loading) return <div>로딩중...</div>;

  if (history.length === 0) {
    return (
      <EmptyState>
        조회한 이미지가 없습니다.
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

const History = () => {
  const [currentView, setCurrentView] = useState('viewed');

  const renderHistoryContent = () => {
    switch (currentView) {
      case 'created':
        return <CreatedHistory />;
      case 'viewed':
        return <ViewHistory />;
      case 'uploaded':
        return <UploadHistory />;
      default:
        return <ViewHistory />;
    }
  };

  return (
    <div className="history-container">
      <h2>히스토리</h2>
      <div className="history-nav">
        <button
          className={`history-nav-button ${currentView === 'created' ? 'active' : ''}`}
          onClick={() => setCurrentView('created')}
        >
          생성 기록
        </button>
        <button
          className={`history-nav-button ${currentView === 'viewed' ? 'active' : ''}`}
          onClick={() => setCurrentView('viewed')}
        >
          조회 기록
        </button>
        <button
          className={`history-nav-button ${currentView === 'uploaded' ? 'active' : ''}`}
          onClick={() => setCurrentView('uploaded')}
        >
          내 업로드
        </button>
      </div>
      {renderHistoryContent()}
    </div>
  );
};

export default Mypage;
