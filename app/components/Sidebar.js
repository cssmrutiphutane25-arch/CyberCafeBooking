"use client";
import "./sidebar.css";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace("/");
    }

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <div className="logo-icon">🖥️</div>

                <div>
                    <h2>CyberCafé</h2>
                    <span>Booking System</span>
                </div>
            </div>

            <nav className="sidebar-nav">

                <button
                    className={`nav-item ${
                        pathname === "/dashboard" ? "active" : ""
                    }`}
                    onClick={() => router.push("/dashboard")}
                >
                    <span>▦</span>
                    Dashboard
                </button>

                <button
                    className={`nav-item ${
                        pathname === "/bookings" ? "active" : ""
                    }`}
                    onClick={() => router.push("/bookings")}
                >
                    <span>📋</span>
                    Bookings
                </button>

            </nav>

            <button
                className="logout-button"
                onClick={handleLogout}
            >
                <span>↪</span>
                Logout
            </button>

        </aside>
    );
}