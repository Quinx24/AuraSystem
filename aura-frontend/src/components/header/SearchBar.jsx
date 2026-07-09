import { Search } from "lucide-react";

export default function SearchBar({ className = "", placeholder = "Search...", smallHidden = true }) {
    return (
        <div className={`${smallHidden ? 'hidden sm:block' : ''} ${className}`}>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-44 rounded-xl border border-gray-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100 md:w-64"
                />
            </div>
        </div>
    );
}
