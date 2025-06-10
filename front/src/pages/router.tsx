import {Route, Routes} from "react-router-dom";
import Login from "./Login";
import Signin from "./Signin";
import App from "../components/App";
import Mypage from "./Mypage";
import Edit from "./Edit";
import Upload from "./Upload";
// TODO: 테스트 후 삭제 예정
import TestEdit from "../test_pages/TestEdit";

function RouterConfig(){
    return(
        <Routes>
            <Route path="/account/login" element={<Login/>}/>
            <Route path="/account/signup" element={<Signin/>}/>
            <Route path="/" element={<App/>}/>
            <Route path="/mypage" element={<Mypage />}/>
            <Route path="/edit/:id" element={<Edit />}/>
            <Route path="/Upload" element={<Upload />}/>
            {/* TODO: 테스트 후 삭제 예정 */}
            <Route path="/test-edit" element={<TestEdit />}/>
        </Routes>
    )
}
export default RouterConfig;