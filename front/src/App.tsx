import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Emoji from './Emoji'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>최근 업로드</h1>
      </div>
      <div id="main">
        <h1>여러 이모티콘들</h1 >
        <Emoji />
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
        
        </p>
      </div>
      <p className="read-the-docs">
        테스트
      </p>
    </>
  )
}

export default App
