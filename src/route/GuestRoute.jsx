import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";

const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children;
};

export default GuestRoute;