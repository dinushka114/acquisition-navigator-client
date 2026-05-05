import { Navigate } from "react-router-dom";
import { getUser } from "../../lib/authStorage.js";

/** @param {{ children: React.ReactNode, allow: string[] }} props */
export function RoleRoute({ children, allow }) {
  const user = getUser();
  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
