"use client";

export default function KovaInput({ label, hint, ...props }) {
  return (
    <label className="kova-field">
      {label && <span className="kova-field__label">{label}</span>}
      <input className="kova-field__input" {...props} />
      {hint && <span className="kova-field__helper">{hint}</span>}
    </label>
  );
}
