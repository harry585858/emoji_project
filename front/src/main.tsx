import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/index.css';
import Header from './components/Header.tsx';
import { BrowserRouter } from 'react-router-dom';
import RouterConfig from './pages/router.tsx';  // 라우팅 처리하는 컴포넌트
//https://github.com/harry585858/emoji_project.git
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />  {/* Header는 상단에 항상 보여짐 */}
      <RouterConfig />  {/* 라우팅을 처리 */}
    </BrowserRouter>
  </StrictMode>
);
