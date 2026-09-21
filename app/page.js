"use client";

import { useRouter } from "next/navigation";
import "./page.css";

export default function Home() {
    const router = useRouter();

    return (
        <main className="landing-page">

            <nav className="navbar">
                <div className="logo">
                    Cyber<span>Café</span>
                </div>

                <div className="nav-buttons">
                    <button
                        className="login-btn"
                        onClick={() => router.push("/login")}
                    >
                        Sign In
                    </button>

                    <button
                        className="signup-btn"
                        onClick={() => router.push("/signup")}
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            <section className="hero-section">

                <div className="hero-content">
                    <p className="welcome-text">
                        WELCOME TO CYBER CAFÉ
                    </p>

                    <h1>
                        Computer Booking
                        <br />
                        Made <span>Simple.</span>
                    </h1>

                    <p className="hero-description">
                        Easily manage computer bookings, keep track of
                        customers, and organize your cyber café bookings
                        in one simple place.
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="primary-btn"
                            onClick={() => router.push("/signup")}
                        >
                            Get Started
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => router.push("/login")}
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                <div className="hero-card">
                    <div className="computer-icon">🖥️</div>

                    <h2>Manage Your Bookings</h2>

                    <p>
                        Add, edit and manage your cyber café
                        computer bookings easily.
                    </p>

                    <div className="mini-stats">
                        <div>
                            <strong>24</strong>
                            <span>Bookings</span>
                        </div>

                        <div>
                            <strong>12</strong>
                            <span>Computers</span>
                        </div>
                    </div>
                </div>

            </section>

            <footer>
                © 2026 Cyber Café Computer Booking System
            </footer>

        </main>
    );
}