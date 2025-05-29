import { useState } from 'react';
import '../assets/Mypage.css';

const Mypage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  // 테스트용 더미 데이터
  const testUserInfo = {
    userID: 'test1234',
    email: 'test@example.com'
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }
    alert('테스트 모드: 비밀번호 변경 요청이 전송되었습니다.');
    setNewPassword('');
  };

  const handleWithdraw = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    alert('테스트 모드: 회원 탈퇴 요청이 전송되었습니다.');
  };

  const renderContent = () => {
    switch (selected) {
      case '아이디':
        return (
          <div className="info-section">
            <p><strong>아이디:</strong> {testUserInfo.userID}</p>
            <p><strong>이메일:</strong> {testUserInfo.email}</p>
          </div>
        );

      case '개인정보 변경':
        return (
          <div className="settings-section">
            <div className="password-change">
              <label>
                <span>새 비밀번호 입력:</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호"
                />
              </label>
              <button className="confirm-button" onClick={handlePasswordChange}>
                비밀번호 변경
              </button>
            </div>
            <div className="withdraw-section">
              <p>회원 탈퇴 시 모든 데이터가 삭제되며, 이 작업은 되돌릴 수 없습니다.</p>
              <div className="withdraw-buttons">
                <button className="confirm-button" onClick={handleWithdraw}>회원탈퇴</button>
              </div>
            </div>
          </div>
        );

      case '즐겨찾기':
        return (
          <div className="empty-section">
            즐겨찾기 기능은 현재 준비 중입니다.
          </div>
        );

      case '생성 기록':
        return (
          <div className="empty-section">
            생성 기록 기능은 현재 준비 중입니다.
          </div>
        );

      default:
        return <div>왼쪽 메뉴에서 항목을 선택해주세요.</div>;
    }
  };

  const menuItems = ['아이디', '개인정보 변경', '즐겨찾기', '생성 기록'];

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
