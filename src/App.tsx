import { BrowserRouter, Route, Routes } from "react-router-dom";

import { EmployeeList } from "@/components/pages/EmployeeList";
import { Sample } from "@/components/pages/Sample";
import { appUrl } from "@/config/url";
import { MainVideoList } from "@/components/pages/MainVideoList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sample />} />
        <Route path={appUrl.employeeList} element={<EmployeeList />} />
        <Route path={appUrl.mainVideoList} element={<MainVideoList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
