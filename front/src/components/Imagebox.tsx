import '../assets/Imagebox.css';

interface ImageDetail {
  imageID: number;
  title: string;
  imageURL: string;
  tags?: string[];
  is_favorite?: boolean;
}

interface ImageBoxProps {
  isEditMode?: boolean;
  imageData?: ImageDetail;
}

const ImageBox = ({ isEditMode, imageData }: ImageBoxProps) => {

  return (
    <div className="image-box">
      <div className="image-info">
        만든 사람: {imageData?.title || 'ddd'} / 좋아요: ddd / 기타정보
      </div>
      <img
        src={imageData?.imageURL || "../assets/test.png"}
        alt={imageData?.title || "emoji"}
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
          <button onClick={() => { window.location.href = "/edit"; }}>수정</button>
        )}
      </div>
    </div>
  );
};

export default ImageBox;
