// დაუმოწმებელ მომხმარებელს შესვლის გვერდზე აგზავნის და საწყის მისამართს ინახავს.
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user.isLoggedIn) {
    // შესვლის შემდეგ მომხმარებელს დაცულ თავდაპირველ მისამართზე ვაბრუნებთ.
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
