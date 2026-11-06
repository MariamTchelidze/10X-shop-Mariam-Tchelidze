// პროფილის სექციებში გამოსაყენებელ საერთო ველს აჩვენებს.
interface ProfileFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email" | "password" | "tel";
  autoComplete?: string;
  placeholder?: string;
  helperText?: string;
  inputMode?: "text" | "numeric" | "tel";
  pattern?: string;
  minLength?: number;
  error?: string;
}

export function ProfileField({
  id,
  label,
  value,
  onChange,
  required = true,
  type = "text",
  autoComplete,
  placeholder,
  helperText,
  inputMode,
  pattern,
  minLength,
  error,
}: ProfileFieldProps) {
  // ყველა პარამეტრი მშობლისგან მოდის, რის გამოც ველი კონტროლირებადია და ხელახლა გამოიყენება.
  return (
    <div className="grid w-full min-w-0 max-w-full gap-2">
      <label
        className="text-[10px] uppercase tracking-[0.14em] text-market-muted"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={pattern}
        minLength={minLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-hint` : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-12 w-full min-w-0 max-w-full border-b bg-transparent px-1 text-sm text-market-ink outline-none transition-colors placeholder:text-market-muted focus:border-gold ${error ? "border-error ring-1 ring-error" : "border-market-border"}`}
      />
      {error ? <p className="text-xs leading-5 text-error" id={`${id}-error`} role="alert">{error}</p> : null}
      {helperText ? (
        <p className="text-xs leading-5 text-market-muted" id={`${id}-hint`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
