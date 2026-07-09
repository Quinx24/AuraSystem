import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function Toast({ message, type = "info", onClose, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-violet-500" size={20} />,
    };

    const bgColors = {
        success: "bg-emerald-50 border-emerald-200",
        error: "bg-red-50 border-red-200",
        info: "bg-violet-50 border-violet-200",
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl transition-all duration-300 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            } ${bgColors[type]}`}
        >
            {icons[type]}
            <p className="text-sm font-medium text-gray-800">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-2 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
            >
                <X size={16} />
            </button>
        </div>
    );
}
