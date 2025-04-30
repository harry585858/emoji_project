import { useState } from 'react';
import '../assets/Header.css';

function Loginbox() {
  const [login, setLogin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLogin(true);  // 로그인 상태 업데이트 (여기선 단순 예시로)
    // 로그인 성공 후 동작 추가 가능
  };

  return (
    <div id='main1'>
      <div id='left'></div>
      <div id='right'>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Loginbox;