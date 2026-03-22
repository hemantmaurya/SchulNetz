import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GeneralDashboard from "./pages/GeneralDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            {/* ADMIN ONLY */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute role="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* ALL LOGGED IN USERS */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <GeneralDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;