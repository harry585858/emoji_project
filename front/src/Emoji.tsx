import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Emoji.css'

function Emoji() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id='imgcontainer'>
        <img alt='이미지 없음'>
        </img>
      </div>
    </>
  )
}

export default Emoji
