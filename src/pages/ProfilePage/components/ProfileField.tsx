interface ProfileFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email";
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  pattern?: string;
  minLength?: number;
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
  inputMode,
  pattern,
  minLength,
}: ProfileFieldProps) {
  return (
    <label
      className="grid min-w-0 gap-2 text-[10px] uppercase tracking-[0.14em] text-market-muted"
      htmlFor={id}
    >
      {label}
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full border-b border-market-border bg-transparent px-1 text-sm text-market-ink outline-none transition-colors placeholder:text-market-muted focus:border-gold"
      />
    </label>
  );
}
