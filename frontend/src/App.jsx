import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GeneralDashboard from "./pages/GeneralDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AppRouter from "./routes/AppRouter.jsx";
import Student from "./features/student/student.jsx";

function App() {
    return <AppRouter/>
}

export default App;