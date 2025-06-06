import { useState } from 'react';
import '../assets/Header.css';
import config from '../config';
import axios from 'axios';
import keeplogo from '../assets/keeplogo.png';
function Loginbox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${config.apiurl}accounts/login/`, {
        userID: username,
        userPW: password, 
      },{
        withCredentials: true
      });
      console.log('success', response);
      if (response.status !== 200) {
        throw new Error('로그인에 실패했습니다. 사용자명 또는 비밀번호를 확인하세요.');
      }
      const data = response.data;  // response.json() 대신 data에 직접 접근
      if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      //const userID = response.data.userID;
      document.cookie = `userID=${username}; path=/; SameSite=None`;//설정필요
      localStorage.setItem('userID', username);
      document.location.href = '/';
      alert('로그인 성공');
    } else {
  setError('로그인에 실패했습니다. 사용자명 또는 비밀번호를 확인하세요.');
  alert('로그인실패');
}
    } catch (err)
    {
      if(err instanceof Error){
        alert('아이디 또는 비밀번호가 맞지 않습니다');
        return;
      }
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      alert(error);
    }
};

  return (
    <div id="main1">
      <div id="left">
        <img src={keeplogo}></img>
      </div>
      <div id="right">
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
        </form>
        <button id='signinbtn' onClick={() => {window.location.href = '/account/signup'; }}>회원가입</button>
      </div>
    </div>
  );
}

export default Loginbox;
