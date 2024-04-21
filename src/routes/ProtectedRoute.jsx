import { useMemo } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";

export default function ProtectedRoute({ child }) {
  const authService = useMemo(() => AuthService(), []);
  const navigate = useNavigate;

  useEffect(() => {
    const checkToken = async () => {
      if (!localStorage.getItem("user") || !(await authService.validateToken()))
        navigate("/login");
    };
    checkToken();
  }, [authService, navigate]);
  return <>{child}</>;
}

ProtectedRoute.propTypes = {
  child: PropTypes.node,
};
