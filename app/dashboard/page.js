"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import Sidebar from "../components/Sidebar";
import "./dashboard.css";

export default function Dashboard() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        async function checkUser() {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                router.replace("/login");
                return;
            }

            setUser(data.user);

            const { data: bookingData, error: bookingError } =
                await supabase
                    .from("bookings")
                    .select("*")
                    .order("created_at", { ascending: false });

            if (!bookingError) {
                setBookings(bookingData);
            }

            setLoading(false);
        }
        checkUser();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace("/");
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const totalBookings = bookings.length;

    const today = new Date().toDateString();

    const todaysBookings = bookings.filter(
        (booking) =>
            new Date(booking.created_at).toDateString() === today
    ).length;

    const bookingsWithNotes = bookings.filter(
        (booking) => booking.note && booking.note.trim() !== ""
    ).length;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">

                <header className="dashboard-header">

                    <div>
                        <p className="header-small">CYBER CAFÉ</p>
                        <h1>Dashboard</h1>
                    </div>

                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{user?.email}</strong>
                            <span>Logged in</span>
                        </div>
                    </div>

                </header>


                <section className="welcome-section">

                    <div>
                        <p className="welcome-label">WELCOME BACK 👋</p>

                        <h2>
                            Manage your cyber café bookings
                        </h2>

                        <p>
                            Keep track of customer bookings and manage
                            them easily from one place.
                        </p>
                    </div>

                    <button
                        className="add-booking-button"
                        onClick={() => router.push("/bookings")}
                    >
                        + Add Booking
                    </button>

                </section>


                <section className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon">📋</div>

                        <div>
                            <span>Total Bookings</span>
                            <h3>{totalBookings}</h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">📅</div>

                        <div>
                            <span>Today's Bookings</span>
                            <h3>{todaysBookings}</h3>
                        </div>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon">🖥️</div>

                        <div>
                            <span>Bookings With Notes</span>
                            <h3>{bookingsWithNotes}</h3>
                        </div>
                    </div>

                </section>


                <section className="recent-section">

                    <div className="section-heading">
                        <div>
                            <h2>Recent Bookings</h2>
                            <p>Your latest cyber café bookings will appear here.</p>
                        </div>

                        <button
                            onClick={() => router.push("/bookings")}
                            className="view-button"
                        >
                            View All
                        </button>
                    </div>

                    <div className="empty-bookings">

                        {bookings.length === 0 ? (

                            <div className="empty-bookings">

                                <div className="empty-icon">
                                    📋
                                </div>

                                <h3>No bookings yet</h3>

                                <p>
                                    Add your first customer booking to get started.
                                </p>

                                <button
                                    onClick={() => router.push("/bookings")}
                                    className="empty-button"
                                >
                                    Add Your First Booking
                                </button>

                            </div>

                        ) : (

                            <div className="dashboard-bookings">

                                {bookings.slice(0, 5).map((booking) => (

                                    <div
                                        key={booking.id}
                                        className="dashboard-booking"
                                    >

                                        <div>
                                            <strong>
                                                {booking.customer_name}
                                            </strong>

                                            <p>
                                                {booking.note || "No note added"}
                                            </p>
                                        </div>

                                        <span>
                                            {new Date(
                                                booking.created_at
                                            ).toLocaleDateString("en-IN")}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}