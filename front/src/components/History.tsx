import React from 'react';
import { useNavigate, useLocation, Link, Route, Routes, Navigate } from 'react-router-dom';
import ViewHistory from './History/ViewHistory';
import UploadHistory from './History/UploadHistory';
import '../assets/History.css';

const History = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === '/mypage/history') {
      navigate('/mypage/history/viewed');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="history-container">
      <div className="history-nav">
        <Link to="viewed">조회 기록</Link>
        <Link to="upload">업로드 기록</Link>
      </div>
      <Routes>
        <Route index element={<Navigate to="viewed" replace />} />
        <Route path="viewed" element={<ViewHistory />} />
        <Route path="upload" element={<UploadHistory />} />
      </Routes>
    </div>
  );
};

export default History; 