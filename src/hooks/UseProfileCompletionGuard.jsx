import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";

const API_URL = import.meta.env.VITE_API_URL;
const CHECK_INTERVAL_MS = 30000; // 30 seconds
const MANDATORY_FIELDS = ["phone", "bloodGroup", "district", "gender"];

// Paths where we should never force-redirect (already there, or not logged in yet)
const EXCLUDED_PATHS = ["/complete-profile", "/login", "/register"];

// Runs in the background for as long as the component using it is mounted.
// Every 30s, checks whether the logged-in user's DB profile has all the
// mandatory donor fields. If not — and they're not already on the
// complete-profile page — it redirects them there.
//
// Usage: call this once inside a top-level layout, e.g. MainLayout.jsx
//   const MainLayout = () => {
//       useProfileCompletionGuard();
//       return ( ...existing layout... );
//   };
export default function useProfileCompletionGuard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.email) return;

        let cancelled = false;

        const checkProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/users/${encodeURIComponent(user.email)}`);

                // If the DB doc doesn't exist yet (e.g. mid-registration), skip silently
                if (!res.ok) return;

                const data = await res.json();
                if (cancelled) return;

                const missing = MANDATORY_FIELDS.filter((field) => !data?.[field]);
                const currentPath = window.location.pathname;

                if (missing.length > 0 && !EXCLUDED_PATHS.includes(currentPath)) {
                    navigate("/complete-profile");
                }
            } catch (err) {
                // network hiccup — just try again on the next tick
            }
        };

        const interval = setInterval(checkProfile, CHECK_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);
}