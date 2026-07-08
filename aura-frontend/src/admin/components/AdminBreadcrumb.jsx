import { ChevronRight } from "lucide-react";

export default function AdminBreadcrumb({ items }) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            {items.map((item, index) => (
                <span key={item} className="flex items-center gap-1.5">
                    {index > 0 && <ChevronRight size={14} className="text-slate-400" />}
                    <span
                        className={
                            index === items.length - 1
                                ? "font-medium text-violet-600"
                                : ""
                        }
                    >
                        {item}
                    </span>
                </span>
            ))}
        </nav>
    );
}
