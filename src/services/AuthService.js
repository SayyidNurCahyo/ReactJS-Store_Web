import axiosInstance from "../api/AxiosInstance";

const AuthService = () => {
  const login = async (payload) => {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data;
  };

  const registerAdmin = async (payload) => {
    const { data } = await axiosInstance.post("/auth/registerAdmin", payload);
    return data;
  };

  const validateToken = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/validate-token");
      return data.statusCode === 200;
    } catch (error) {
      localStorage.removeItem("user");
      return false;
    }
  };

  return {
    login,
    registerAdmin,
    validateToken,
  };
};

export default AuthService;
