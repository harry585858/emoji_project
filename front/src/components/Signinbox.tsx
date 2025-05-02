import { useState } from 'react';
import '../assets/Header.css';

function Signinbox() {
  // 상태 관리: 비밀번호, 비밀번호 확인
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // 비밀번호 확인 함수
  const checkPasswords = (event) => {
    event.preventDefault(); // 폼 제출 기본 동작을 막음
    
    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // 비밀번호가 일치하면 폼 제출 (여기서는 콘솔에 출력)
    setError('');
    console.log('폼 제출됨');
    // 실제 폼 제출 처리 로직을 여기에 추가
  };

  return (
    <div id="main1">
      <div id="left"></div>
      <div id="right">
        <form onSubmit={checkPasswords}>
          <input
            type="text"
            placeholder="ID"
            // ID 상태 관리 (사용자 ID 입력)
          />
          <input
            type="password"
            placeholder="PW"
            value={password} // 비밀번호 상태
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 변경 시 상태 업데이트
          />
          <input
            type="password"
            placeholder="PWRE"
            value={confirmPassword} // 비밀번호 확인 상태
            onChange={(e) => setConfirmPassword(e.target.value)} // 비밀번호 확인 변경 시 상태 업데이트
          />
          {error && <span style={{ color: 'red' }}>{error}</span>} {/* 오류 메시지 */}
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default Signinbox;
