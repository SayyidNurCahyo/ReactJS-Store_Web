import { useMemo } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";

export default function ProtectedRoute({ children }) {
  const authService = useMemo(() => AuthService(), []);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if (!localStorage.getItem("user") || !(await authService.validateToken())) navigate("/login")
    };
    checkToken();
  }, [authService, navigate]);
  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
