import React, { useState } from 'react';
import '../assets/Header.css';
import config from '../config';
import axios from 'axios';
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
      });

      if (response.status !== 200) {
        throw new Error('로그인에 실패했습니다. 사용자명 또는 비밀번호를 확인하세요.');
      }
      const data = response.data;  // response.json() 대신 data에 직접 접근
      if (data.access) {
      localStorage.setItem('access_token', data.access);
      const userID = response.data.userID;
      document.location.href = '/';
      alert('로그인 성공');
      document.cookie = `userID=${userID}; expires=Wed, 19 May 2025 12:00:00 UTC; path=/; SameSite=None`;
    } 
    else {
  setError('로그인에 실패했습니다. 사용자명 또는 비밀번호를 확인하세요.');
}

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
};

  return (
    <div id="main1">
      <div id="left"></div>
      <div id="right">
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button id='signinbtn' onClick={() => {window.location.href = '/account/signup'; }}>signup</button>
      </div>
    </div>
  );
}

export default Loginbox;