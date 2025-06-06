import {Route, Routes} from "react-router-dom";
import Login from "./Login";
import Signin from "./Signin";
import App from "../components/App";
import Mypage from "./Mypage";
import Detail from "./Detail";
import Edit from "./Edit";
import Upload from "./Upload";

function RouterConfig(){
    return(
        <Routes>
            <Route path="/account/login" element={<Login/>}/>
            <Route path="/account/signup" element={<Signin/>}/>
            <Route path="/" element={<App/>}/>
            <Route path="/mypage" element={<Mypage />}/>
            <Route path="/detail/:imageId" element={<Detail />}/>
            <Route path="/Edit" element={<Edit />}/>
            <Route path="/Upload" element={<Upload />}/>
        </Routes>
    )
}
export default RouterConfig;