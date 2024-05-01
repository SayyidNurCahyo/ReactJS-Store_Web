import axiosInstance from "../api/AxiosInstance";

const TableService = () => {
  const create = async (payload) => {
    const { data } = await axiosInstance.post("/tables", payload);
    return data;
  };

  const getById = async (id) => {
    const { data } = await axiosInstance.get(`/tables/${id}`);
    return data; 
  };

  const getAll = async (query) => {
    const { data } = await axiosInstance.get(`/tables`, { params: query });
    return data;
  };

  const update = async (payload) => {
    const { data } = await axiosInstance.put("/tables", payload);
    return data;
  };

  const deleteById = async (id) => {
    const { data } = await axiosInstance.delete(`/tables/${id}`);
    return data;
  };

  return {
    create,
    getById,
    getAll,
    update,
    deleteById,
  };
};

export default TableService;
