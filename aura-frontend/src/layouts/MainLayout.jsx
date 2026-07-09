import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { PageMetaProvider } from "../contexts/PageMetaContext";

export default function MainLayout() {

  return (

    <div className="bg-[#FAFBFF] min-h-screen">

      <Sidebar />

      <div className="xl:ml-[280px] min-h-screen flex flex-col">

        <PageMetaProvider>
          <Header showSearch={true} showNotification={true} showUserMenu={true} />
          <main className="flex-1 p-4 md:p-6 xl:p-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </PageMetaProvider>

      </div>

    </div>

  );

}
