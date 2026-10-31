interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  autoComplete: string;
  visible: boolean;
  invalid: boolean;
  error?: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

export function PasswordField({
  id,
  label,
  value,
  autoComplete,
  visible,
  invalid,
  error,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-[0.16em] text-market-muted">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          aria-invalid={invalid}
          onChange={(event) => onChange(event.target.value)}
          className={`min-h-12 w-full border-b bg-transparent px-1 pr-12 text-sm text-market-ink outline-none transition-colors placeholder:text-market-muted focus:border-market-ink ${invalid ? "border-red-500 ring-1 ring-red-500" : "border-market-border"}`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-market-muted transition-colors hover:text-market-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <PasswordVisibilityIcon visible={visible} />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-error" role="alert">{error}</p>}
    </div>
  );
}

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.6 9.5 7-.4.9-1.2 2-2.3 3M6.2 6.2C4.3 7.5 3 9.5 2.5 12c1 2.4 4.5 7 9.5 7 1 0 2-.2 2.9-.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
