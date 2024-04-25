import axiosInstance from "../api/AxiosInstance";

const CustomerService = () => {
  const getById = async (id) => {
    const { data } = await axiosInstance.get(`/customers/${id}`);
    return data;
  };

  const getAll = async (query) => {
    const { data } = await axiosInstance.get(`/customers`, {params : query});
    return data;
  };

  const update = async (payload) => {
    const { data } = await axiosInstance.put('/customers', payload);
    return data;
  };

  const deleteById = async (id) => {
    const { data } = await axiosInstance.delete(`/customers/${id}`);
    return data;
  };

  return {
    getById, getAll, update, deleteById
  };
};

export default CustomerService;
