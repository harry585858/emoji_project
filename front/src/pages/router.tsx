import {Route, Routes} from "react-router-dom";
import Main from  '../Main';
function RouterConfig(){
    return(
        <Routes>
            <Route path="/main" element={<Main/>}/>
        </Routes>
    )
}
export default RouterConfig;