import { useState } from 'react'
import '../assets/App.css'
import Emoji from './Emoji'
// 첫 화면 내부 이미지 모음
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>최근 업로드</h1>
      </div>
      <div id="main">
        <h1>여러 이모티콘들</h1 >
        <ul>
        <Emoji />
        </ul>ub
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
