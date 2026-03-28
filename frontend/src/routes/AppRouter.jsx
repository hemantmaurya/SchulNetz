import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "../components/layout/Layout";
import AdminDashboard from "../pages/AdminDashboard";
import GeneralDashboard from "../pages/GeneralDashboard";
import Testing from "../pages/Testing";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Admin Route */}
                <Route 
                    path="/admin" 
                    element={
                        <Layout>
                            <AdminDashboard />
                        </Layout>
                    } 
                />

                {/* Normal User Dashboard */}
                <Route 
                    path="/dashboard" 
                    element={
                        <Layout>
                            <GeneralDashboard />
                        </Layout>
                    } 
                />

                {/* Testing Page - Inside Layout */}
                <Route path="/testing" element={ <Layout> <Testing /> </Layout> } />


                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
