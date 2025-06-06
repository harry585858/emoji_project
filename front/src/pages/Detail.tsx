import TagBox from "../components/Tagbox";
import ImageBox from "../components/Imagebox";

const Detail = () => {
  return (
    <div style={{ display: "flex", height: "80vh", margin: "10vh auto", width: "90%" }}>
      <TagBox />
      <ImageBox isEditMode={false} />
    </div>
  );
};

export default Detail;
