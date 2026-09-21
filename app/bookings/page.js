"use client";
import Sidebar from "../components/Sidebar";
import "./bookings.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function Bookings() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);

    const [customerName, setCustomerName] = useState("");
    const [note, setNote] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [message, setMessage] = useState("");

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError || !userData.user) {
            router.replace("/login");
            return;
        }

        setUser(userData.user);

        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            setMessage(error.message);
        } else {
            setBookings(data);
        }

        setLoading(false);
    }

    async function handleAddBooking(e) {
        e.preventDefault();

        if (!customerName.trim()) {
            setMessage("Please enter the customer name.");
            return;
        }

        setSaving(true);
        setMessage("");

        const { data, error } = await supabase
            .from("bookings")
            .insert([
                {
                    user_id: user.id,
                    customer_name: customerName.trim(),
                    note: note.trim()
                }
            ])
            .select()
            .single();

        if (error) {
            setMessage(error.message);
            setSaving(false);
            return;
        }

        setBookings([data, ...bookings]);

        setCustomerName("");
        setNote("");

        setMessage("Booking added successfully!");

        setSaving(false);
    }

    function startEditing(booking) {
        setEditingId(booking.id);
        setCustomerName(booking.customer_name);
        setNote(booking.note || "");
        setMessage("");
    }

    function cancelEditing() {
        setEditingId(null);
        setCustomerName("");
        setNote("");
        setMessage("");
    }

    async function handleUpdateBooking(e) {
        e.preventDefault();

        if (!customerName.trim()) {
            setMessage("Please enter the customer name.");
            return;
        }

        setSaving(true);
        setMessage("");

        const { data, error } = await supabase
            .from("bookings")
            .update({
                customer_name: customerName.trim(),
                note: note.trim()
            })
            .eq("id", editingId)
            .select()
            .single();

        if (error) {
            setMessage(error.message);
            setSaving(false);
            return;
        }

        setBookings(
            bookings.map((booking) =>
                booking.id === editingId ? data : booking
            )
        );

        setEditingId(null);
        setCustomerName("");
        setNote("");

        setMessage("Booking updated successfully!");

        setSaving(false);
    }

    async function handleDeleteBooking(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this booking?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(id);
        setMessage("");

        const { error } = await supabase
            .from("bookings")
            .delete()
            .eq("id", id);

        if (error) {
            setMessage(error.message);
            setDeletingId(null);
            return;
        }

        setBookings(
            bookings.filter((booking) => booking.id !== id)
        );

        if (editingId === id) {
            cancelEditing();
        }

        setMessage("Booking deleted successfully!");

        setDeletingId(null);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace("/");
    }

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px"
                }}
            >
                Loading bookings...
            </div>
        );
    }

   return (
    <div className="bookings-layout">

        <Sidebar />

        <main className="bookings-main">

            <header className="bookings-header">

                <div>
                    <p className="header-small">
                        CYBER CAFÉ
                    </p>

                    <h1>Bookings</h1>
                </div>

                {user && (
                    <div className="user-info">

                        <div className="user-avatar">
                            {user.email.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{user.email}</strong>
                            <span>Logged in</span>
                        </div>

                    </div>
                )}

            </header>


            <section className="booking-grid">

                <div className="booking-card">

                    <h2>
                        {editingId
                            ? "Edit Booking"
                            : "Add Booking"}
                    </h2>

                    <p className="card-description">
                        {editingId
                            ? "Update the booking details below."
                            : "Enter the customer details below."}
                    </p>

                    <form
                        onSubmit={
                            editingId
                                ? handleUpdateBooking
                                : handleAddBooking
                        }
                    >

                        <label className="form-label">
                            Customer Name
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter customer name"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(e.target.value)
                            }
                            required
                        />


                        <label className="form-label">
                            Note
                        </label>

                        <textarea
                            className="form-textarea"
                            placeholder="Example: 2 hours internet browsing"
                            value={note}
                            onChange={(e) =>
                                setNote(e.target.value)
                            }
                            rows="5"
                        />


                        <button
                            className="primary-button"
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? editingId
                                    ? "Updating..."
                                    : "Adding..."
                                : editingId
                                    ? "Update Booking"
                                    : "Add Booking"}
                        </button>


                        {editingId && (
                            <button
                                className="secondary-button"
                                type="button"
                                onClick={cancelEditing}
                            >
                                Cancel Edit
                            </button>
                        )}

                    </form>


                    {message && (
                        <p className="message">
                            {message}
                        </p>
                    )}

                </div>


                <div className="booking-list-card">

                    <div className="booking-list-header">

                        <div>
                            <h2>All Bookings</h2>

                            <p className="card-description">
                                Manage your customer bookings.
                            </p>
                        </div>

                        <span className="booking-count">
                            {bookings.length} Booking
                            {bookings.length !== 1 ? "s" : ""}
                        </span>

                    </div>


                    {bookings.length === 0 ? (

                        <div className="empty-bookings">

                            <div className="empty-bookings-icon">
                                📋
                            </div>

                            <h3>No bookings yet</h3>

                            <p>
                                Add your first customer booking
                                using the form.
                            </p>

                        </div>

                    ) : (

                        <div>

                            {bookings.map((booking) => (

                                <div
                                    className="booking-item"
                                    key={booking.id}
                                >

                                    <div className="booking-item-top">

                                        <div>

                                            <h3>
                                                {booking.customer_name}
                                            </h3>

                                            <p className="booking-note">
                                                {booking.note ||
                                                    "No note added"}
                                            </p>

                                            <span className="booking-date">
                                                {new Date(
                                                    booking.created_at
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </span>

                                        </div>


                                        <div className="booking-actions">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    startEditing(booking)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDeleteBooking(
                                                        booking.id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    booking.id
                                                }
                                            >
                                                {deletingId === booking.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

                                        </div>

                                    </div>

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