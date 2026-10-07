"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const CATEGORY_MEASUREMENTS: Record<
    string,
    { subhead: string; note: string; fields: { id: string; label: string; placeholder: string }[] }
> = {
    shoes: {
        subhead: "Footwear Sizing & Measurements",
        note: "Provide your standard shoe size and custom foot measurements for bespoke shoes.",
        fields: [
            { id: "shoeSize", label: "Standard Shoe Size (EU / UK / US)", placeholder: 'e.g. EU 43 / UK 9 / US 10' },
            { id: "footLength", label: "Foot Length", placeholder: 'e.g. 10.5" or 27cm' },
            { id: "footWidth", label: "Foot Width (Ball of Foot)", placeholder: 'e.g. 4.1" or 10.5cm' },
            { id: "ballGirth", label: "Ball Girth / Circumference", placeholder: 'e.g. 9.8"' },
            { id: "instepGirth", label: "Instep Circumference", placeholder: 'e.g. 9.5"' },
            { id: "heelInstep", label: "Heel to Instep", placeholder: 'e.g. 13.5"' },
            { id: "widthFit", label: "Width / Fit Preference", placeholder: 'e.g. Narrow, Standard, Wide' },
            { id: "archType", label: "Arch Type", placeholder: 'e.g. Normal, High Arch, Flat' },
        ],
    },
    slippers: {
        subhead: "Slipper Sizing & Measurements",
        note: "Provide your standard size and foot dimensions for handcrafted bespoke slippers.",
        fields: [
            { id: "shoeSize", label: "Standard Shoe Size (EU / UK / US)", placeholder: 'e.g. EU 43 / UK 9 / US 10' },
            { id: "footLength", label: "Foot Length", placeholder: 'e.g. 10.5" or 27cm' },
            { id: "footWidth", label: "Foot Width (Ball of Foot)", placeholder: 'e.g. 4.1" or 10.5cm' },
            { id: "instepGirth", label: "Instep Height / Girth", placeholder: 'e.g. 9.5"' },
            { id: "fitPreference", label: "Fit Preference", placeholder: 'e.g. Snug, Standard, Relaxed' },
            { id: "stylePreference", label: "Style Preference", placeholder: 'e.g. Slide, Mule, Closed-Toe, Traditional' },
        ],
    },
    shirts: {
        subhead: "Shirt Measurements (Inches)",
        note: "Enter measurements in inches. Leave any that don't apply blank.",
        fields: [
            { id: "neck", label: "Neck Circumference", placeholder: 'e.g. 16"' },
            { id: "chest", label: "Chest", placeholder: 'e.g. 40"' },
            { id: "waist", label: "Waist", placeholder: 'e.g. 34"' },
            { id: "shoulder", label: "Shoulder Width", placeholder: 'e.g. 18"' },
            { id: "sleeve", label: "Sleeve Length", placeholder: 'e.g. 25"' },
            { id: "shirtLength", label: "Shirt Length", placeholder: 'e.g. 30"' },
            { id: "bicep", label: "Bicep", placeholder: 'e.g. 14"' },
            { id: "wrist", label: "Wrist Circumference", placeholder: 'e.g. 7.5"' },
        ],
    },
    suits: {
        subhead: "Suit Measurements (Inches)",
        note: "Enter measurements in inches. Leave any that don't apply blank.",
        fields: [
            { id: "chest", label: "Chest", placeholder: 'e.g. 40"' },
            { id: "waist", label: "Waist", placeholder: 'e.g. 34"' },
            { id: "hips", label: "Hips", placeholder: 'e.g. 42"' },
            { id: "shoulder", label: "Shoulder Width", placeholder: 'e.g. 18"' },
            { id: "sleeve", label: "Sleeve Length", placeholder: 'e.g. 25"' },
            { id: "neck", label: "Neck", placeholder: 'e.g. 16"' },
            { id: "inseam", label: "Inseam", placeholder: 'e.g. 32"' },
            { id: "outseam", label: "Outseam / Trouser Length", placeholder: 'e.g. 42"' },
        ],
    },
    default: {
        subhead: "Measurements (Inches)",
        note: "Enter measurements in inches. Leave any that don't apply blank.",
        fields: [
            { id: "chest", label: "Chest", placeholder: 'e.g. 40"' },
            { id: "waist", label: "Waist", placeholder: 'e.g. 34"' },
            { id: "hips", label: "Hips", placeholder: 'e.g. 42"' },
            { id: "shoulder", label: "Shoulder Width", placeholder: 'e.g. 18"' },
            { id: "sleeve", label: "Sleeve Length", placeholder: 'e.g. 25"' },
            { id: "neck", label: "Neck", placeholder: 'e.g. 16"' },
            { id: "inseam", label: "Inseam", placeholder: 'e.g. 32"' },
            { id: "outseam", label: "Outseam / Trouser Length", placeholder: 'e.g. 42"' },
        ],
    },
};

export default function SendMeasurements() {
    const [submitted, setSubmitted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("suits");
    const [fileName, setFileName] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const currentConfig = CATEGORY_MEASUREMENTS[selectedCategory] || CATEGORY_MEASUREMENTS.default;

    if (submitted) {
        return (
            <main className="store-page bespoke-form-page">
                <div className="bespoke-success">
                    <p className="eyebrow"></p>
                    <h1>Received.</h1>
                    <p>
                        We&rsquo;ve received your measurements. Our team will review them
                        and reach out within 48 hours to discuss your piece.
                    </p>
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
                .form-subhead {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: var(--ink);
                    font-weight: 600;
                    margin: 28px 0 16px;
                    font-family: var(--ui-sans, sans-serif);
                }
                .upload-dropzone {
                    border: 1px dashed var(--line);
                    padding: 24px;
                    text-align: center;
                    cursor: pointer;
                    margin-bottom: 20px;
                    transition: border-color 0.2s ease, background-color 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .upload-dropzone:hover {
                    border-color: #000000;
                    background-color: rgba(0, 0, 0, 0.02);
                }
                .upload-dropzone p {
                    font-size: 11px;
                    letter-spacing: 0.5px;
                    color: var(--muted);
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
                    <h5>Upload Measurements</h5>
                    <p>Fill in your measurements below, or upload a file with your sizing details.</p>
                </div>

                <form className="bespoke-form" style={{ maxWidth: '100%' }} onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                    {/* Contact */}
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

                    {/* Garment / Footwear Category */}
                    <div className="form-field">
                        <label htmlFor="interest">What are you interested in?</label>
                        <select
                            id="interest"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            required
                        >
                            <option value="suits">Suits</option>
                            <option value="shirts">Shirts</option>
                            <option value="shoes">Shoes</option>
                            <option value="slippers">Slippers</option>
                            <option value="kaftans">Kaftans</option>
                            <option value="jackets">Jackets</option>
                            <option value="other">Other / Not sure yet</option>
                        </select>
                    </div>

                    {/* Dynamic Measurements Section */}
                    <div className="form-subhead">{currentConfig.subhead}</div>
                    <p className="fine-print" style={{ marginBottom: 16 }}>
                        {currentConfig.note}
                    </p>
                    <div className="measurements-grid">
                        {currentConfig.fields.map((f) => (
                            <div className="form-field" key={f.id}>
                                <label htmlFor={f.id}>{f.label}</label>
                                <input id={f.id} type="text" placeholder={f.placeholder} />
                            </div>
                        ))}
                    </div>

                    {/* File upload */}
                    <div className="form-subhead">Or Upload Measurement Sheet</div>
                    <div className="upload-dropzone" onClick={() => fileRef.current?.click()}>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="sr-only"
                            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                        />
                        {fileName ? (
                            <p style={{ color: '#000', fontWeight: 500 }}>{fileName}</p>
                        ) : (
                            <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.25">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <p>Click to upload a file (PDF, image, doc)</p>
                            </>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="form-field">
                        <label htmlFor="notes">Additional Notes</label>
                        <textarea id="notes" rows={3} placeholder="Style preferences, occasion, questions..." />
                    </div>

                    <button type="submit" className="shop-button">
                        Submit Measurements
                        <svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none">
                            <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.25" />
                        </svg>
                    </button>
                    <p className="fine-print">
                        We&rsquo;ll review your measurements and follow up within 48 hours.
                    </p>
                </form>
            </div>
        </main>
    );
}
