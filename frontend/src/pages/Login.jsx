import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import API from "../lib/api.js";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
         
        
        



        try {
            const res = await API.post("/api/auth/login", {   // ← Fixed: added /api
                email,
                password,

            });

            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));


            console.log("running");


            setMessage("Login successful!");

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed. Please check credentials.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT SIDE */}
            <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-center px-16">
                <h1 className="text-5xl font-semibold mb-6">SchulNetz ERP</h1>
                <p className="text-lg text-gray-300 max-w-md">Manage your college with a modern ERP system.</p>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f5f5f7] px-6">
                <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Sign in</h2>

                    {message && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-600 text-center">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="flex items-center border rounded-xl px-4 py-3">
                            <Mail className="text-gray-400 mr-3" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center border rounded-xl px-4 py-3">
                            <Lock className="text-gray-400 mr-3" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-3 bg-black text-white rounded-xl font-medium"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;