import { useState } from 'react';
import '../assets/Mypage.css';

const Mypage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const renderContent = () => {
    switch (selected) {
      case '아이디':
        return <div>ID: ddd</div>;

      case '즐겨찾기들':
      case '내 이모티콘':
        return (
          <div className={`grid-box-container ${selected === '내 이모티콘' ? 'darker' : ''}`}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="image-placeholder" />
            ))}
          </div>
        );

      case '비밀번호 변경':
  return (
    <div className="password-change">
      <p><strong>현재 비밀번호:</strong> test1234</p>
      <label>
        <span>새 비밀번호 입력:</span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
        />
      </label>
      <button className="confirm-button">확인</button>
    </div>
  );


      case '회원탈퇴':
        return (
          <div className="withdraw-section">
            <p>정말로 탈퇴하시겠습니까?</p>
            <div className="withdraw-buttons">
              <button className="confirm-button">예</button>
              <button className="cancel-button">아니오</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const menuItems = ['아이디', '즐겨찾기들', '내 이모티콘', '비밀번호 변경', '회원탈퇴'];

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

export default Mypage;
