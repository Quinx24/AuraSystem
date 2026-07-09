import { Navigate } from "react-router-dom";

export default function RouteGuard({ children, requireAdmin = false }) {
    const role = localStorage.getItem("role");

    if (requireAdmin && role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
