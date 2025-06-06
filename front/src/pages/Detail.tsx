import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
import config from '../config';
=======
>>>>>>> 0a337f79a9d69e90c832717c10abbcd9bf15c791
import TagBox from "../components/Tagbox";
import ImageBox from "../components/Imagebox";
import testImage from '../assets/test.png';

interface ImageDetail {
  imageID: number;
  title: string;
  imageURL: string;
  tags?: string[];
}

const Detail = () => {
  const { imageId } = useParams();
  const [imageDetail, setImageDetail] = useState<ImageDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 테스트용 데이터 설정
    const testData: ImageDetail = {
      imageID: Number(imageId),
      title: `테스트 이미지 ${imageId}`,
      imageURL: testImage,
      tags: ['태그1', '태그2']
    };
    setImageDetail(testData);
    setLoading(false);
  }, [imageId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!imageDetail) {
    return <div>이미지를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ display: "flex", height: "80vh", margin: "10vh auto", width: "90%" }}>
      <TagBox />
      <ImageBox isEditMode={false} imageData={imageDetail} />
    </div>
  );
};

export default Detail;
