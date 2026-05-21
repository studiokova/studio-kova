"use client";
import KovaNav from "@/components/kova/KovaNav";

export default function KovaStepShell({ offerLabel, currentStep, totalSteps, children }) {
  return (
    <>
      <style>{`
        .ks-bar { display: flex; gap: 6px; padding: 16px 24px 0; }
        .ks-segment { flex: 1; height: 3px; border-radius: 99px; background: #D3D1C7; }
        .ks-segment.done { background: #B8612A; }
        .ks-segment.active { background: #B8612A; opacity: 0.5; }
        .ks-label { padding: 10px 24px 16px; font-size: 11px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.10em; color: #888780; font-family: "DM Sans", sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
      <KovaNav full />
      <div className="ks-bar">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isDone = i < currentStep - 1;
          const isActive = i === currentStep - 1;
          return (
            <div
              key={i}
              className={`ks-segment${isDone ? " done" : ""}${isActive ? " active" : ""}`}
            />
          );
        })}
      </div>
      <div className="ks-label">{offerLabel} · Étape {currentStep}/{totalSteps}</div>
      {children}
    </>
  );
}
