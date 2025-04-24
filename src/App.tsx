import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LikeVideoList } from "@/components/pages/LikeVideoList";
import { MainVideoList } from "@/components/pages/MainVideoList";
import { Policy } from "@/components/pages/Policy";
import { appUrl } from "@/config/url";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={appUrl.mainVideoList} element={<MainVideoList />} />
        <Route path={appUrl.likeVideoList} element={<LikeVideoList />} />
        <Route path={appUrl.policy} element={<Policy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
