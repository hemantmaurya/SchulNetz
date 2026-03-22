import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // not logged in
    if (!token) {
        return <Navigate to="/" />;
    }

    // role check
    if (role && user?.role !== role) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default ProtectedRoute;