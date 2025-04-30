import { useState } from 'react'
import '../assets/Header.css'
import { redirect } from 'react-router-dom'
//헤더
function Header() {
  const [login, setLogin] = useState(false)
  return (
    <>
    <div id='header'>
      <form action="/search">
      <input type="text" placeholder='검색어 입력'/>
      </form>
      {login ? (
  <button id='headerbtn' onClick={() => { window.location.href = '/mypage'; }}>마이페이지</button>
) : (
  <button id='headerbtn' onClick={() => { window.location.href = '/login'; }}>로그인</button>
)}
    </div>
    </>
  )
}

export default Header