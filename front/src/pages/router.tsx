import {Route, Routes} from "react-router-dom";
import Login from "./Login";
import Signin from "./Signin";
import App from "../components/App";
function RouterConfig(){
    return(
        <Routes>
            <Route path="/account/login" element={<Login/>}/>
            <Route path="/account/signup" element={<Signin/>}/>
            <Route path="/" element={<App/>}/>
        </Routes>
    )
}
export default RouterConfig;