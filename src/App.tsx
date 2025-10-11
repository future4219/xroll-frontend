import BootInit from "@/auth/BootInit";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DMCA } from "@/components/pages/DMCA";
import { Gofile } from "@/components/pages/Gofile";
import { GofileLikeVideo } from "@/components/pages/GofileLikeVideo";
import { GofileLogin } from "@/components/pages/GofileLogin";
import { GofileSearch } from "@/components/pages/GofileSearch";
import { GofileUser } from "@/components/pages/GofileUser";
import { GofileVault } from "@/components/pages/GofileVault";
import { GofileWatch } from "@/components/pages/GofileWatch";
import { LikeVideoList } from "@/components/pages/LikeVideoList";
import { MainVideoList } from "@/components/pages/MainVideoList";
import { Policy } from "@/components/pages/Policy";
import { TwitterVideoSave } from "@/components/pages/TwitterVideoSave";
import { USC2257 } from "@/components/pages/USC2257";
import { appUrl } from "@/config/url";
import { GofileRegister } from "@/components/pages/GofileRegister";
import { GofileVerify } from "@/components/pages/GofileVerify";
import { RealtimeVideoList } from "./components/pages/RealtimeVideoList";

function App() {
  return (
    <BrowserRouter>
      {/* ← ここで全ページ共通で一度だけ実行 */}
      <BootInit />

      <Routes>
        <Route path={appUrl.mainVideoList} element={<MainVideoList />} />
        <Route path={appUrl.likeVideoList} element={<LikeVideoList />} />
        <Route
          path={appUrl.realtimeVideoList}
          element={<RealtimeVideoList />}
        />
        <Route path={appUrl.policy} element={<Policy />} />
        <Route path={appUrl.twitterVideoSave} element={<TwitterVideoSave />} />
        <Route path={appUrl.dmca} element={<DMCA />} />
        <Route path={appUrl.usc2257} element={<USC2257 />} />

        <Route path={appUrl.gofile} element={<Gofile />} />
        <Route path={appUrl.gofileLogin} element={<GofileLogin />} />
        <Route path={appUrl.gofileRegister} element={<GofileRegister />} />
        <Route path={appUrl.gofileVerify} element={<GofileVerify />} />

        <Route path={appUrl.gofileVault} element={<GofileVault />} />
        <Route path={appUrl.gofileSearch} element={<GofileSearch />} />
        <Route path={appUrl.gofileWatch} element={<GofileWatch />} />
        <Route path={appUrl.gofileUser} element={<GofileUser />} />
        <Route path={appUrl.gofileLikeVideo} element={<GofileLikeVideo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
