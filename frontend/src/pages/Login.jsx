import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", {
                email,
                password,
            });

            const { token, user } = res.data;

            // store data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setMessage("Login successful!");

            // redirect based on role
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            setMessage(
                err.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* LEFT */}
            <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-center px-16">
                <h1 className="text-5xl font-semibold mb-6">
                    SchulNetz ERP
                </h1>
                <p className="text-lg text-gray-300 max-w-md">
                    Manage your college with a modern ERP system.
                </p>
            </div>

            {/* RIGHT */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f5f5f7] px-6">

                <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">

                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Sign in
                    </h2>

                    {message && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-600 text-center">
                                {message}
                            </p>
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
                            />
                        </div>

                        <button className="w-full py-3 bg-black text-white rounded-xl">
                            Sign in
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;