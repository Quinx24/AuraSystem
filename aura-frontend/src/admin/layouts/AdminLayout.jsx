import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

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
                <AdminHeader />

                <main className="flex-1 p-4 md:p-6 xl:p-8">
                    <div className="mx-auto w-full max-w-[1600px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
