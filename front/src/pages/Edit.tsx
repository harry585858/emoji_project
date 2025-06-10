
import { useParams } from "react-router-dom";
import TagBox from "../components/Tagbox";
import ImageBox from "../components/Imagebox";

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const imageId = id ? parseInt(id) : 0;

  return (
    <div style={{ 
      display: "flex", 
      flexWrap: "wrap",
      height: "auto", 
      minHeight: "85vh",
      margin: "0 auto", 
      width: "95%", 
      gap: "30px", 
      paddingTop: "80px" 
    }}>
      <div style={{ 
        width: "250px",
        minWidth: "250px",
        marginBottom: "20px"
      }}>
        <TagBox imageId={imageId} />
      </div>
      <div style={{ 
        display: "flex", 
        flex: 1,
        minWidth: "600px",
        gap: "20px" 
      }}>
        <ImageBox isOriginal={true} imageId={imageId} />
        <ImageBox isOriginal={false} imageId={imageId} />
      </div>
    </div>
  );
};

export default Edit;
