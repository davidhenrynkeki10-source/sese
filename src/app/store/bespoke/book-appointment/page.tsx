"use client";

import Link from "next/link";
import { useState } from "react";

export default function BookAppointment() {
    const [submitted, setSubmitted] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    // Minimum date = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    const timeSlots = [
        "9:00 AM - 12:00 PM",
        "3:00 PM - 5:00 PM",
    ];

    const displayDate = selectedDate
        ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        })
        : "";

    if (submitted) {
        return (
            <main className="store-page bespoke-form-page">
                <div className="bespoke-success">
                    <p className="eyebrow"></p>
                    <h1>Thank you.</h1>
                    <p>Your appointment request has been received. We&rsquo;ll confirm via email within 24 hours.</p>
                    <Link href="/store/bespoke" className="arrow-link">
                        Return to Bespoke
                        <svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none">
                            <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.25" />
                        </svg>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="store-page bespoke-form-page" style={{ padding: '50px 40px 90px 40px', boxSizing: 'border-box' }}>
            <style dangerouslySetInnerHTML={{__html: `
                .back-link-custom {
                    text-decoration: none;
                    color: var(--menu-muted, #b0b0b0);
                    font-weight: 500;
                    font-size: 11.5px;
                    letter-spacing: 0.6px;
                    display: inline-block;
                    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), color 0.2s ease;
                    transform-origin: left center;
                    font-family: var(--ui-sans, sans-serif);
                    text-transform: none;
                    margin-bottom: 40px;
                }
                .back-link-custom:hover {
                    transform: scale(1.18);
                    opacity: 1;
                    color: #000000;
                }
                .bespoke-form-left-col {
                    max-width: 50%;
                    width: 100%;
                }
                @media (max-width: 768px) {
                    .bespoke-form-left-col {
                        max-width: 100% !important;
                    }
                }
            `}} />
            <Link href="/store/bespoke" className="back-link-custom">
                &lt;&lt; back
            </Link>

            <div className="bespoke-form-left-col">
                <div className="store-heading">
                    <h5>Book an Appointment</h5>
                    <p>Select a date and time for your private consultation.</p>
                </div>

                <form className="bespoke-form" style={{ maxWidth: '100%' }} onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                    <div className="form-field">
                        <label htmlFor="date">Choose a Date</label>
                        <input
                            id="date"
                            type="date"
                            required
                            min={minDate}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        {selectedDate && (
                            <p className="cal-selected-label">
                                Selected: <strong>{displayDate}</strong>
                            </p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="time">Preferred Time</label>
                        <select id="time" required>
                            <option value="">Select a time</option>
                            {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" type="text" required autoComplete="given-name" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" type="text" required autoComplete="family-name" />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" required autoComplete="email" />
                    </div>

                    <div className="form-field">
                        <label htmlFor="phone">Phone Number</label>
                        <input id="phone" type="tel" autoComplete="tel" />
                    </div>

                    <div className="form-field">
                        <label htmlFor="interest">What are you interested in?</label>
                        <select id="interest">
                            <option value="">Select a category</option>
                            <option value="suits">Suits</option>
                            <option value="shirts">Shirts</option>
                            <option value="shoes">Shoes</option>
                            <option value="slippers">Slippers</option>
                            <option value="kaftans">Kaftans</option>
                            <option value="jackets">Jackets</option>
                            <option value="other">Other / Not sure yet</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="notes">Additional Notes</label>
                        <textarea id="notes" rows={3} placeholder="Style preferences, occasion, questions..." />
                    </div>

                    <button type="submit" className="shop-button" disabled={!selectedDate}>
                        Request Appointment
                        <svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none">
                            <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.25" />
                        </svg>
                    </button>
                    <p className="fine-print">
                    </p>
                </form>
            </div>
        </main>
    );
}

