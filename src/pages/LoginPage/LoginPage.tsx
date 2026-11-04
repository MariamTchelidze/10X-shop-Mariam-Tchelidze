// Login-ისა და დამატებითი რეგისტრაციის კონტროლირებად ფორმებს მართავს.
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { PasswordField } from "./components/PasswordField";

interface FormValues { fullName: string; email: string; password: string; confirmPassword: string }
type FormErrors = Partial<Record<keyof FormValues, string>>;

export function LoginPage() {
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(() => new URLSearchParams(location.search).get("mode") === "register");
  const [values, setValues] = useState<FormValues>({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [credentialsInvalid, setCredentialsInvalid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const navigateAfterAuth = (): void => {
    // დაცულ გვერდზე გადასვლამდე შენახულ მისამართს მხოლოდ შიდა route-ისას ვიღებთ.
    const from = (location.state as { from?: unknown } | null)?.from;
    navigate(typeof from === "string" && from.startsWith("/") ? from : "/", { replace: true });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (isSubmitting) return;

    // CORE Login-ს username/password სჭირდება; რეგისტრაციას დამატებით email-ის ვალიდაცია აქვს.
    const nextErrors: FormErrors = {};
    const identifier = values.email.trim();
    const fullName = values.fullName.trim();

    if (isRegistering) {
      if (!fullName) nextErrors.fullName = "Full name is required.";
      if (!identifier.includes("@") || !identifier.includes(".")) nextErrors.email = "Enter a valid email address.";
      if (values.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
      if (values.confirmPassword !== values.password) nextErrors.confirmPassword = "Passwords do not match.";
    } else {
      if (!identifier) nextErrors.email = "Username is required";
      if (!values.password) nextErrors.password = "Password is required";
      else if (values.password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    setCredentialsInvalid(false);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        const result = await register(fullName, identifier, values.password);
        if (result === "exists") {
          setErrors({ email: "An account with this email already exists." });
          return;
        }
        if (result === "storage-error") {
          setErrors({ email: "Unable to save this account in browser storage." });
          return;
        }
        addToast("ACCOUNT CREATED", "success");
      } else {
        const result = await login(identifier, values.password);
        if (result === "invalid") {
          setCredentialsInvalid(true);
          setErrors({ email: "Email or password is incorrect.", password: "Email or password is incorrect." });
          return;
        }
        addToast("WELCOME BACK", "success");
      }
      navigateAfterAuth();
    } catch {
      setErrors({ password: "Unable to complete sign in. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormValues): string =>
    `min-h-12 w-full border-b bg-transparent px-1 text-sm text-market-ink outline-none transition-colors placeholder:text-market-muted focus:border-market-ink ${errors[field] || (credentialsInvalid && !isRegistering) ? "border-red-500 ring-1 ring-red-500" : "border-market-border"}`;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-5 py-12">
      <h1 className="font-display text-center text-4xl text-market-ink">{isRegistering ? "Create account" : "Log in"}</h1>
      <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
        {isRegistering && <div>
          <label htmlFor="fullName" className="mb-2 block text-xs uppercase tracking-[0.16em] text-market-muted">Full name</label>
          <input id="fullName" name="fullName" autoComplete="name" value={values.fullName} aria-invalid={Boolean(errors.fullName)} onChange={(event) => { setValues((current) => ({ ...current, fullName: event.target.value })); setErrors((current) => ({ ...current, fullName: undefined })); }} className={inputClass("fullName")} />
          {errors.fullName && <p className="mt-2 text-sm text-error" role="alert">{errors.fullName}</p>}
        </div>}
        <div>
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.16em] text-market-muted">{isRegistering ? "Email" : "Username"}</label>
          <input id="email" name={isRegistering ? "email" : "username"} type={isRegistering ? "email" : "text"} autoComplete={isRegistering ? "email" : "username"} value={values.email} aria-invalid={Boolean(errors.email) || credentialsInvalid} onChange={(event) => { setValues((current) => ({ ...current, email: event.target.value })); setErrors((current) => ({ ...current, email: undefined })); setCredentialsInvalid(false); }} className={inputClass("email")} />
          {errors.email && <p className="mt-2 text-sm text-error" role="alert">{errors.email}</p>}
        </div>
        <PasswordField
          id="password"
          label="Password"
          value={values.password}
          autoComplete={isRegistering ? "new-password" : "current-password"}
          visible={isPasswordVisible}
          invalid={Boolean(errors.password) || credentialsInvalid}
          error={errors.password}
          onChange={(password) => {
            setValues((current) => ({ ...current, password }));
            setErrors((current) => ({ ...current, password: undefined, confirmPassword: undefined }));
            setCredentialsInvalid(false);
          }}
          onToggleVisibility={() => setIsPasswordVisible((visible) => !visible)}
        />
        {isRegistering && (
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            autoComplete="new-password"
            visible={isConfirmationVisible}
            invalid={Boolean(errors.confirmPassword)}
            error={errors.confirmPassword}
            onChange={(confirmPassword) => {
              setValues((current) => ({ ...current, confirmPassword }));
              setErrors((current) => ({ ...current, confirmPassword: undefined }));
            }}
            onToggleVisibility={() => setIsConfirmationVisible((visible) => !visible)}
          />
        )}
        <button type="submit" disabled={isSubmitting} className="min-h-12 w-full bg-market-ink px-5 text-xs font-medium uppercase tracking-[0.16em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? "Please wait…" : isRegistering ? "Register" : "Log in"}
        </button>
      </form>
      <button type="button" onClick={() => { setIsRegistering((current) => !current); setErrors({}); setCredentialsInvalid(false); setValues((current) => ({ ...current, confirmPassword: "" })); setIsPasswordVisible(false); setIsConfirmationVisible(false); }} className="mt-6 text-center text-xs uppercase tracking-[0.14em] text-market-muted underline-offset-4 hover:text-market-ink hover:underline">
        {isRegistering ? "Already have an account? Log in" : "New to Middle Market? Register"}
      </button>
      <Link to="/" className="mt-6 text-center text-xs uppercase tracking-[0.14em] text-market-muted underline-offset-4 hover:text-market-ink hover:underline">Back to catalog</Link>
    </main>
  );
}
