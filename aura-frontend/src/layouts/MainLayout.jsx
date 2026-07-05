import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {

  return (

    <div className="bg-[#FAFBFF] min-h-screen">

      <Sidebar />

      <main
        className="
          ml-[280px]
          min-h-screen
          p-8
        "
      >

        <Outlet />

      </main>

    </div>

  );

}