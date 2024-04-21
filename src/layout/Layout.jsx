import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";
 
function Layout() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  return (
    <>
      <div className="d-flex">
        <Sidebar isVisible={isSidebarVisible} setVisible={setSidebarVisible} />
        <main className="w-100 flex-grow-1">
          <Header toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} />
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
