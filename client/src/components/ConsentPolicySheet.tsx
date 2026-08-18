import { useEffect, useRef } from "react";
import { Check, ShieldCheck, X } from "lucide-react";

type ConsentPolicySheetProps = {
  onClose: () => void;
  onDecline: () => void;
  onAllow: () => void;
};

export default function ConsentPolicySheet({ onClose, onDecline, onAllow }: ConsentPolicySheetProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTarget = dialogRef.current?.querySelector<HTMLElement>("button");
    focusTarget?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="consent-sheet-backdrop" role="presentation" onMouseDown={onClose}>
      <section ref={dialogRef} className="consent-policy-sheet" role="dialog" aria-modal="true" aria-labelledby="consent-policy-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="consent-sheet-handle" aria-hidden="true" />
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#c9973e]"><ShieldCheck size={14} /> Fortrex / Data policy</div>
            <h2 id="consent-policy-title" className="display mt-3 text-3xl font-bold text-[#fff7e6]">Respecting your choice.</h2>
          </div>
          <button type="button" onClick={onClose} className="consent-sheet-close" aria-label="Close data policy"> <X size={17} /> </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-[#a99b7a]">Fortrex uses a small amount of anonymous, privacy-conscious analytics to understand launch performance and improve the experience. We do not use this preference to identify you or sell your information.</p>
        <div className="consent-policy-list" aria-label="Data policy summary">
          <div><Check size={15} /><span>Anonymous page and interaction events</span></div>
          <div><Check size={15} /><span>Stored locally: your consent preference</span></div>
          <div><Check size={15} /><span>You can change your choice by clearing site data</span></div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onDecline} className="secondary-cta rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[.12em]">Decline analytics</button>
          <button type="button" onClick={onAllow} className="primary-cta rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[.12em]">Allow analytics</button>
        </div>
      </section>
    </div>
  );
}

export type { ConsentPolicySheetProps };

