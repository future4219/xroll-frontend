import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Sample } from "@/components/pages/Sample";
import { appUrl } from "@/config/url";
import { MainVideoList } from "@/components/pages/MainVideoList";
import { LikeVideoList } from "@/components/pages/LikeVideoList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={appUrl.mainVideoList} element={<MainVideoList />} />
        <Route path={appUrl.likeVideoList} element={<LikeVideoList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
