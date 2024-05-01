import axiosInstance from "../api/AxiosInstance";

const TransactionService = () => {
  const create = async (payload) => {
    const { data } = await axiosInstance.post("/transactions", payload);
    return data;
  };

  const getAll = async (query) => {
    const { data } = await axiosInstance.get(`/transactions`, { params: query });
    return data;
  };

  return {
    create,
    getAll,
  };
};

export default TransactionService;
