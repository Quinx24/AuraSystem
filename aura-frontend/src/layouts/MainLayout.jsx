import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {

  return (

    <div className="bg-[#FAFBFF] min-h-screen">

      <Sidebar />

      <main
        className="
          xl:ml-[280px]
          min-h-screen
          p-4
          md:p-6
          xl:p-8
        "
      >

        <div className="mx-auto w-full max-w-[1600px]">
          <Outlet />
        </div>

      </main>

    </div>

  );

}
