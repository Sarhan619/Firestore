import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}
export default PrivateRoute;
