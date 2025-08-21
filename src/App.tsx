import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DMCA } from "@/components/pages/DMCA";
import { Gofile } from "@/components/pages/Gofile";
import { GofileSearch } from "@/components/pages/GofileSearch";
import { GofileUpload } from "@/components/pages/GofileUpload";
import { LikeVideoList } from "@/components/pages/LikeVideoList";
import { MainVideoList } from "@/components/pages/MainVideoList";
import { Policy } from "@/components/pages/Policy";
import { TwitterVideoSave } from "@/components/pages/TwitterVideoSave";
import { USC2257 } from "@/components/pages/USC2257";
import { appUrl } from "@/config/url";
import { GofileVault } from "@/components/pages/GofileVault";
import { GofileWatch } from "@/components/pages/GofileWatch";

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
        <Route path={appUrl.gofile} element={<Gofile />} />
        <Route path={appUrl.gofileVault} element={<GofileVault />} />
        <Route path={appUrl.gofileSearch} element={<GofileSearch />} />
        <Route path={appUrl.gofileUpload} element={<GofileUpload />} />
        <Route path={appUrl.gofileWatch} element={<GofileWatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
