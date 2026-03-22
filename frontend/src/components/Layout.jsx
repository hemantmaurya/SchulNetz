import { NavLink, useLocation } from "react-router-dom";
import { menuItems } from "../config/menu";
import { useState } from "react";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Bell,
} from "lucide-react";

function Layout({ children }) {
    const [openMenu, setOpenMenu] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <div
                className={`relative ${
                    collapsed ? "w-20" : "w-64"
                } bg-black text-white p-4 transition-all duration-300 flex flex-col`}
            >
                {/* TOP: BRAND + USER */}
                <div className="mb-6">
                    {!collapsed && (
                        <>
                            <h1 className="text-xl font-semibold mb-4">
                                SchulNetz
                            </h1>

                            <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-xl">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.email}`}
                                    alt="user"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        {user?.name || user?.email || "User"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {user?.role || "Role"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* MENU */}
                <nav className="flex-1 space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;

                        if (item.children) {
                            const isActiveParent = item.children.some((child) =>
                                location.pathname.startsWith(child.path)
                            );

                            return (
                                <div key={index}>
                                    {/* Parent */}
                                    <div
                                        onClick={() =>
                                            setOpenMenu(openMenu === index ? null : index)
                                        }
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                                            isActiveParent
                                                ? "bg-white text-black"
                                                : "hover:bg-gray-800"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {Icon && <Icon size={18} />}
                                            {!collapsed && <span>{item.name}</span>}
                                        </div>

                                        {!collapsed && (
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform ${
                                                    openMenu === index ? "rotate-180" : ""
                                                }`}
                                            />
                                        )}
                                    </div>

                                    {/* Submenu */}
                                    {!collapsed && openMenu === index && (
                                        <div className="ml-8 mt-2 space-y-1">
                                            {item.children.map((child) => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) =>
                                                        `block px-3 py-2 rounded-md text-sm ${
                                                            isActive
                                                                ? "bg-white text-black"
                                                                : "hover:bg-gray-800"
                                                        }`
                                                    }
                                                >
                                                    {child.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg ${
                                        isActive
                                            ? "bg-white text-black"
                                            : "hover:bg-gray-800"
                                    }`
                                }
                            >
                                {Icon && <Icon size={18} />}
                                {!collapsed && <span>{item.name}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* FOOTER INSIDE SIDEBAR */}
                {!collapsed && (
                    <div className="text-xs text-gray-400 mt-6">
                        <p>SchulNetz ERP</p>
                        <p>v1.0.0</p>
                    </div>
                )}

                {/* COLLAPSE BUTTON (PERFECT POSITION) */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white text-black rounded-full shadow p-1"
                >
                    {collapsed ? (
                        <ChevronRight size={16} />
                    ) : (
                        <ChevronLeft size={16} />
                    )}
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col">

                {/* TOPBAR */}
                <div className="bg-white px-6 py-4 shadow flex justify-between items-center">

                    <h2 className="font-semibold text-lg">
                        Dashboard
                    </h2>

                    <div className="flex items-center gap-4">

                        {/* Notifications */}
                        <Bell className="text-gray-600 cursor-pointer" />

                        {/* Profile */}
                        <div className="relative">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.email}`}
                                alt="user"
                                className="w-8 h-8 rounded-full cursor-pointer"
                                onClick={() => setProfileOpen(!profileOpen)}
                            />

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow">
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.href = "/";
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-6">
                    {children}
                </div>

                {/* FOOTER */}
                <div className="bg-white text-center text-sm text-gray-500 py-3 border-t">
                    © 2026 SchulNetz ERP
                </div>

            </div>
        </div>
    );
}

export default Layout;