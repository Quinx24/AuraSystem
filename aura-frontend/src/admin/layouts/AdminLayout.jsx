import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Header from "../../components/Header";
import { PageMetaProvider } from "../../contexts/PageMetaContext";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const mainMargin = collapsed ? "lg:ml-[80px]" : "lg:ml-[280px]";

    return (
        <div className="min-h-screen bg-[#FAFBFF]">
            <AdminSidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
            />

            <div
                className={`${mainMargin} flex min-h-screen flex-col transition-all duration-300`}
            >
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
