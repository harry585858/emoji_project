import ImageBox from "../components/Imagebox";
import { useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const imageId = id ? parseInt(id) : 0;

  return (
    <div style={{
      width: "100%",
      margin: "0 auto",
      minHeight: "85vh",
      paddingTop: "80px",
      display: "flex",
      flexDirection: "row",
      gap: "30px"
    }}>
      <div style={{ flex: 1, minWidth: "600px", gap: "20px", display: "flex" }}>
        <ImageBox isOriginal={true} imageId={imageId} />
        <ImageBox isOriginal={false} imageId={imageId} />
      </div>
    </div>
  );
};

export default Edit;
