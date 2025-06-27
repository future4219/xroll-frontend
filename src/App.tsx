import { BrowserRouter, Route, Router, Routes } from "react-router-dom";

import { LikeVideoList } from "@/components/pages/LikeVideoList";
import { MainVideoList } from "@/components/pages/MainVideoList";
import { Policy } from "@/components/pages/Policy";
import { appUrl } from "@/config/url";
import { TwitterVideoSave } from "@/components/pages/TwitterVideoSave";
import { DMCA } from "@/components/pages/DMCA";
import { USC2257 } from "@/components/pages/USC2257";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={appUrl.mainVideoList} element={<MainVideoList />} />
        <Route path={appUrl.likeVideoList} element={<LikeVideoList />} />
        <Route path={appUrl.policy} element={<Policy />} />
        <Route path={appUrl.twitterVideoSave} element={<TwitterVideoSave />} />
        <Route path={appUrl.dmca} element={<DMCA />} />
        <Route path={appUrl.usc2257} element={<USC2257 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
