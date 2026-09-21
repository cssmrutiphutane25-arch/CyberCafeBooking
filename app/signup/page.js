"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import styles from "../auth.module.css";

export default function Signup() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
            return;
        }

        router.push("/login");
    }

    return (
        <main className={styles.authPage}>

            <section className={styles.authLeft}>
                <div className={styles.logo}>
                    Cyber<span>Café</span>
                </div>

                <h1>
                    Start
                    <br />
                    Managing!
                </h1>

                <p>
                    Create your account and start managing
                    your cyber café computer bookings from
                    one simple application.
                </p>

                <div className={styles.featureList}>

                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        Create and manage bookings
                    </div>

                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        Keep customer information organized
                    </div>

                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        Access your bookings securely
                    </div>

                </div>
            </section>


            <section className={styles.authRight}>

                <div className={styles.authCard}>

                    <button
                        className={styles.backButton}
                        onClick={() => router.push("/")}
                    >
                        ← Back to Home
                    </button>

                    <h2>Create Account</h2>

                    <p className={styles.subtitle}>
                        Create an account to get started.
                    </p>

                    <form onSubmit={handleSignup}>

                        <div className={styles.formGroup}>
                            <label>Email Address</label>

                            <input
                                className={styles.input}
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>


                        <div className={styles.formGroup}>
                            <label>Password</label>

                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>


                        <button
                            className={styles.submitButton}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                    </form>

                    {message && (
                        <p className={styles.message}>
                            {message}
                        </p>
                    )}

                    <p className={styles.bottomText}>
                        Already have an account?{" "}
                        <span
                            className={styles.link}
                            onClick={() => router.push("/login")}
                        >
                            Sign In
                        </span>
                    </p>

                </div>

            </section>

        </main>
    );
}