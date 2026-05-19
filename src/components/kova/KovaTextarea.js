"use client";

export default function KovaTextarea({ label, hint, ...props }) {
  return (
    <label className="kova-field">
      {label && <span className="kova-field__label">{label}</span>}
      <textarea className="kova-field__textarea" {...props} />
      {hint && <span className="kova-field__helper">{hint}</span>}
    </label>
  );
}
