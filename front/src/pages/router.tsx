import {Route, Routes} from "react-router-dom";
import Login from "./Login";
import App from "./App";
function RouterConfig(){
    return(
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<App/>}/>
        </Routes>
    )
}
export default RouterConfig;