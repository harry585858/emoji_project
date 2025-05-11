import '../assets/Imagebox.css';
import { useLocation, useNavigate } from "react-router-dom";

const ImageBox = ({ isEditMode }: { isEditMode?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className="image-box">
      <div className="image-info">만든 사람: ddd / 좋아요: ddd / 기타정보보</div>
      <img
        src="../assets/test.png"
        alt="emoji"
        className="image"
      />
      <div className="image-actions">
        {isEditMode ? (
          <>
            <input
              className="text-input"
              type="text"
              placeholder="텍스트를 입력하세요"
            />
            <button>제출</button>
          </>
        ) : (
          <button onClick={() => navigate("/edit")}>수정</button>
        )}
      </div>
    </div>
  );
};

export default ImageBox;
