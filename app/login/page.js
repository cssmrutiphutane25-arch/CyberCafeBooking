"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import styles from "../auth.module.css";

export default function Login() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
    }

    return (
        <main className={styles.authPage}>

            <section className={styles.authLeft}>
                <div className={styles.logo}>
                    Cyber<span>Café</span>
                </div>

                <h1>
                    Welcome
                    <br />
                    Back!
                </h1>

                <p>
                    Sign in to manage your cyber café bookings,
                    keep track of customers, and organize your
                    workspace easily.
                </p>

                <div className={styles.featureList}>

                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        Easy booking management
                    </div>

                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        Organized customer records
                    </div>

                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        Secure account access
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

                    <h2>Sign In</h2>

                    <p className={styles.subtitle}>
                        Enter your account details to continue.
                    </p>

                    <form onSubmit={handleLogin}>

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
                                placeholder="Enter your password"
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
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                    </form>

                    {message && (
                        <p className={styles.message}>
                            {message}
                        </p>
                    )}

                    <p className={styles.bottomText}>
                        Don't have an account?{" "}
                        <span
                            className={styles.link}
                            onClick={() => router.push("/signup")}
                        >
                            Create Account
                        </span>
                    </p>

                </div>

            </section>

        </main>
    );
}