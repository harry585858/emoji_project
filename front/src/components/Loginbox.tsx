import React, { useState } from 'react';
import '../assets/Header.css';
import config from '../config';

function Loginbox() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${config.apiurl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다. 사용자명 또는 비밀번호를 확인하세요.');
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        setLogin(true);
        // 로그인 성공 후 추가 동작을 여기에 작성하세요.
      } else {
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
        {error && <p className="error">{error}</p>}
        <button
          id="signinbtn"
          onClick={() => {
            window.location.href = '/account/create';
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Loginbox;
