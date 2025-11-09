import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import Loader from "./loading";

const ProtectedRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) return <Loader />;

  if (!currentUser || !currentUser.emailVerified) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;