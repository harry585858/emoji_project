import { useState } from 'react'
import './Emoji.css'
import myimg from './assets/test.png'

function Emoji() {
  const [count, setCount] = useState(0)

  return (
    <>
    <li>
      <div id='imgcontainer'>
        <img src={myimg} alt='이미지 없음'>
        </img>
        <h3>제목</h3>
        <p>제작자</p>
      </div>
      </li>
    </>
  )
}

export default Emoji
