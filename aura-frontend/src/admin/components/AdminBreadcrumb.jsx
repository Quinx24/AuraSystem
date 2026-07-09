import { ChevronRight } from "lucide-react";

export default function AdminBreadcrumb({ items }) {
    return (
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-600 md:text-base">
            {items.map((item, index) => (
                <span key={item} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight size={16} className="text-slate-400" />}
                    <span className={index === items.length - 1 ? "font-semibold text-violet-600" : ""}>
                        {item}
                    </span>
                </span>
            ))}
        </nav>
    );
}
