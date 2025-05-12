
import '../assets/Mypage.css';

const Mypage = () => {
  return (
    <div className="mypage-container">
      <aside className="mypage-sidebar">
        <button className="mypage-button">아이디</button>
        <button className="mypage-button">즐겨찾기들</button>
        <button className="mypage-button">내 이모티콘</button>
        <button className="mypage-button">비밀번호 변경</button>
        <button className="mypage-button">회원탈퇴</button>
      </aside>
      <main className="mypage-content">
        {/* 추후 기능 구현 시 이 영역 사용 */}
      </main>
    </div>
  );
};

export default Mypage;
