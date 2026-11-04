// უცნობ მისამართს ერთიან 404 გვერდზე აჩვენებს.
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-market-ink">Page not found</h1>
      <p className="mt-3 text-market-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-flex min-h-11 items-center text-sm text-market-ink underline underline-offset-4">
        Go to catalog
      </Link>
    </main>
  );
}
