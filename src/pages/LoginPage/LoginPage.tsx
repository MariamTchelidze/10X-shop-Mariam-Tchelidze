// Login-ისა და რეგისტრაციის ფორმებს Formik-ით მართავს.
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { LoginFormValues } from "../../types/user";
import { assertNever } from "../../utils/assertNever";
import { loginSchema, registerSchema } from "../../validation/authSchemas";
import { PasswordField } from "./components/PasswordField";

export function LoginPage() {
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(() => new URLSearchParams(location.search).get("mode") === "register");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const navigateAfterAuth = (): void => {
    // დაცულ გვერდზე გადასვლამდე შენახულ მისამართს მხოლოდ შიდა route-ისას ვიღებთ.
    const from = (location.state as { from?: unknown } | null)?.from;
    navigate(typeof from === "string" && from.startsWith("/") ? from : "/", { replace: true });
  };

  const formik = useFormik<LoginFormValues>({
    initialValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    validationSchema: isRegistering ? registerSchema : loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      if (import.meta.env.DEV) console.log("[DEBUG 10X SHOP]: Login form submit handler reached.");
      const identifier = values.email.trim();
      const fullName = values.fullName.trim();

      try {
        if (isRegistering) {
          const result = await register(fullName, identifier, values.password);
          switch (result.status) {
            case "success":
              addToast("ACCOUNT CREATED", "success");
              navigateAfterAuth();
              return;
            case "error":
              switch (result.errorType) {
                case "EMAIL_EXISTS":
                case "STORAGE_ERROR":
                  helpers.setFieldError("email", result.message);
                  helpers.setFieldTouched("email", true, false);
                  return;
                case "GENERAL":
                  helpers.setFieldError("password", result.message);
                  helpers.setFieldTouched("password", true, false);
                  return;
                default:
                  return assertNever(result.errorType);
              }
            default:
              return assertNever(result);
          }
        }

        const result = await login(identifier, values.password);
        switch (result.status) {
          case "success":
            addToast("WELCOME BACK", "success");
            navigateAfterAuth();
            return;
          case "error":
            switch (result.errorType) {
              case "INVALID_CREDENTIALS":
                helpers.setErrors({ email: result.message, password: result.message });
                helpers.setTouched({ email: true, password: true });
                return;
              case "GENERAL":
                helpers.setFieldError("password", result.message);
                helpers.setFieldTouched("password", true, false);
                return;
              default:
                return assertNever(result.errorType);
            }
          default:
            return assertNever(result);
        }
      } catch {
        helpers.setFieldError("password", "Unable to complete sign in. Please try again.");
        helpers.setFieldTouched("password", true, false);
      }
    },
  });

  const inputClass = (field: keyof LoginFormValues): string =>
    `min-h-12 w-full border-b bg-transparent px-1 text-sm text-market-ink outline-none transition-colors placeholder:text-market-muted focus:border-market-ink ${formik.touched[field] && formik.errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-market-border"}`;

  const toggleFormMode = (): void => {
    setIsRegistering((current) => !current);
    void formik.setTouched({});
    void formik.setErrors({});
    void formik.setFieldValue("confirmPassword", "");
    setIsPasswordVisible(false);
    setIsConfirmationVisible(false);
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-5 py-12">
      <h1 className="font-display text-center text-4xl text-market-ink">{isRegistering ? "Create account" : "Log in"}</h1>
      <form className="mt-10 space-y-6" onSubmit={formik.handleSubmit} noValidate>
        {isRegistering && <div>
          <label htmlFor="fullName" className="mb-2 block text-xs uppercase tracking-[0.16em] text-market-muted">Full name</label>
          <input id="fullName" name="fullName" autoComplete="name" value={formik.values.fullName} aria-invalid={Boolean(formik.touched.fullName && formik.errors.fullName)} aria-describedby={formik.touched.fullName && formik.errors.fullName ? "fullName-error" : undefined} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("fullName")} />
          {formik.touched.fullName && formik.errors.fullName && <p id="fullName-error" className="mt-2 text-sm text-error" role="alert">{formik.errors.fullName}</p>}
        </div>}
        <div>
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.16em] text-market-muted">{isRegistering ? "Email" : "Username"}</label>
          <input id="email" name="email" type={isRegistering ? "email" : "text"} autoComplete={isRegistering ? "email" : "username"} value={formik.values.email} aria-invalid={Boolean(formik.touched.email && formik.errors.email)} aria-describedby={formik.touched.email && formik.errors.email ? "email-error" : undefined} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass("email")} />
          {formik.touched.email && formik.errors.email && <p id="email-error" className="mt-2 text-sm text-error" role="alert">{formik.errors.email}</p>}
        </div>
        <PasswordField
          id="password"
          label="Password"
          value={formik.values.password}
          autoComplete={isRegistering ? "new-password" : "current-password"}
          visible={isPasswordVisible}
          invalid={Boolean(formik.touched.password && formik.errors.password)}
          error={formik.touched.password ? formik.errors.password : undefined}
          onChange={(password) => { void formik.setFieldValue("password", password); }}
          onBlur={() => { void formik.setFieldTouched("password", true); }}
          onToggleVisibility={() => setIsPasswordVisible((visible) => !visible)}
        />
        {isRegistering && (
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={formik.values.confirmPassword}
            autoComplete="new-password"
            visible={isConfirmationVisible}
            invalid={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
            error={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
            onChange={(confirmPassword) => { void formik.setFieldValue("confirmPassword", confirmPassword); }}
            onBlur={() => { void formik.setFieldTouched("confirmPassword", true); }}
            onToggleVisibility={() => setIsConfirmationVisible((visible) => !visible)}
          />
        )}
        <button type="submit" disabled={formik.isSubmitting} className="min-h-12 w-full bg-market-ink px-5 text-xs font-medium uppercase tracking-[0.16em] text-market-paper transition-colors hover:bg-market-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink disabled:cursor-wait disabled:opacity-60">
          {formik.isSubmitting ? "Please wait…" : isRegistering ? "Register" : "Log in"}
        </button>
      </form>
      <button type="button" onClick={toggleFormMode} className="mt-6 inline-flex min-h-11 items-center justify-center text-center text-xs uppercase tracking-[0.14em] text-market-muted underline-offset-4 hover:text-market-ink hover:underline">
        {isRegistering ? "Already have an account? Log in" : "New to 10X Shop? Register"}
      </button>
      <Link to="/" className="mt-6 inline-flex min-h-11 items-center justify-center text-center text-xs uppercase tracking-[0.14em] text-market-muted underline-offset-4 hover:text-market-ink hover:underline">← Back to catalog</Link>
    </main>
  );
}
