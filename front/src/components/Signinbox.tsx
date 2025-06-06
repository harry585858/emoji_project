import { FormEvent, useState } from 'react';
import '../assets/Header.css';
import axios from 'axios';
import config from '../config';
import banner from '../assets/banner.png';
function Signinbox() {
  // 상태 관리: 아이디, 비밀번호, 비밀번호 확인, 오류 메시지
  const [id, setId] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 비밀번호 확인 함수
  const checkPasswords = (event: FormEvent) => {
    event.preventDefault(); // 폼 제출 기본 동작을 막음
    
    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // 유효성 검사 (아이디, 비밀번호, 비밀번호 확인 체크)
    if (id === '' || password === '') {
      setError('All fields are required.');
      return;
    }

    // 비밀번호가 일치하면 회원가입 처리
    setError('');
    submitSignup();
  };

  // 회원가입 API 호출 함수
  const submitSignup = async () => {
    try {
      setLoading(true);  // 로딩 상태 시작

      const response = await axios.post(`${config.apiurl}accounts/signup/`, {
        userID: id,
        userPW: password,
        //userName: username,
      });

      // 회원가입 성공 처리
      if (response.status === 201) {
        console.log('회원가입 성공:', response.data);
        // 예시: 회원가입 후 로그인 페이지로 리디렉션
        window.location.href = '/account/login';  // 로그인 페이지로 이동
      } else {
        setError('회원가입 실패! 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('회원가입 에러:', error.response?.data || error);
      setError(error.response?.data?.error || '회원가입 실패! 알 수 없는 오류');
    } finally {
      setLoading(false);  // 로딩 상태 종료
    }
  };

  return (
    <div id="main1">
      <div id="left">
        <img src={banner}></img>
      </div>
      <div id="right">
        <form onSubmit={checkPasswords}>
        <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setusername(e.target.value)} // ID 상태 업데이트
          />
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)} // ID 상태 업데이트
          />
          <input
            type="password"
            placeholder="PW"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 상태 업데이트
          />
          <input
            type="password"
            placeholder="PWRE"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // 비밀번호 확인 상태 업데이트
          />
          {error && <span style={{ color: 'red' }}>{error}</span>} {/* 오류 메시지 */}
          <input
            type="submit"
            value={loading ? 'Loading...' : 'Sign Up'} // 로딩 중에는 버튼 텍스트 변경
            disabled={loading}  // 로딩 중에는 제출 버튼 비활성화
          />
        </form>
      </div>
    </div>
  );
}

export default Signinbox;