import { Mail, Pencil, Shield } from "lucide-react";
import PageIntroduction from "../../components/PageIntroduction";
import { useEffect } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";

export default function ProfilePage() {
    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Profile", breadcrumb: ["Admin", "Profile"] });
        return () => setPage({});
    }, []);
    return (
        <div>
            <PageIntroduction />

            <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm shadow-violet-100/50">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-3xl font-bold text-white">
                        A
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Admin User
                    </h2>

                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
                        <Shield size={12} />
                        Administrator
                    </span>

                    <div className="mt-6 flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <Mail className="shrink-0 text-slate-400" size={18} />
                        <span className="text-sm text-slate-600">
                            admin@aura.com
                        </span>
                    </div>

                    <button
                        type="button"
                        className="mt-6 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-6 py-2.5 text-sm font-semibold text-violet-600 transition hover:bg-violet-100"
                    >
                        <Pencil size={16} />
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
