import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import TransactionService from "../../services/TransactionService";
import { useEffect } from "react";
import {
  IconDeviceFloppy,
  IconX,
  IconArrowBadgeLeft,
  IconArrowBadgeRight,
} from "@tabler/icons-react";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtil";
import { useState } from "react";
import CustomerService from "../../services/CustomerService";
import SearchDropdown from "../../shared/SearchDropdown/SearchDropdown";
import TableService from "../../services/TableService";
import MenuService from "../../services/MenuService";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import Cart from "./components/Cart";

const schema = zod.object({
  id: zod.string().optional(),
  transactionDate: zod.string().refine((tanggal) => {
    const tgl = new Date(tanggal);
    return !isNaN(tgl) && tgl <= new Date();
  }, "masukan tanggal tidak boleh lebih dari tanggal saat ini"),
  customerId: zod.string(),
  tableId: zod.string().optional(),
  transactionDetails: zod.any(),
});

export default function AddTransaction() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    reset,
    setValue,
    trigger,
    getValues,
  } = useForm({ mode: "onChange", resolver: zodResolver(schema) });
  const transactionService = useMemo(() => TransactionService(), []);
  const customerService = useMemo(() => CustomerService(), []);
  const [dataCustomer, setDataCustomer] = useState();
  const tableService = useMemo(() => TableService(), []);
  const [dataTable, setDataTable] = useState();
  const menuService = useMemo(() => MenuService(), []);

  const [searchParam, setSearchParam] = useSearchParams();
  const [imageIndex, setImageIndex] = useState([]);
  const [store, setStore] = useState();
  const [menuCart, setMenuCart] = useState([]);

  const handleChangeCart = (value) => {
    let cart = menuCart;
    let findCart = cart.findIndex((x) => x.menuId === value.menuId);
    if (findCart !== -1) {
      if (value.menuQuantity === 0) cart.splice(findCart, 1);
      else cart.splice(findCart, 1, value);
    } else cart.push(value);
    setMenuCart(cart);
    setValue(
      "transactionDetails",
      menuCart.map((item) => {
        const newItem = { ...item };
        ["menuName", "menuPrice"].forEach((key) => delete newItem[key]);
        return newItem;
      })
    );
    trigger("transactionDetails");
  };

  const search = searchParam.get("name") || "";
  const page = searchParam.get("page") || "1";
  const size = searchParam.get("size") || "5";
  const query = { name: search, page: page, size: size };

  const [paging, setPaging] = useState({
    page: page,
    size: size,
    totalElement: 0,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  });

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchParam({ name: value, page: "1", size: "5" });
  };

  const handleNextPage = () => {
    if (page >= paging.totalPages) return;
    setSearchParam({ name: search, page: +page + 1, size: size });
  };

  const handlePreviousPage = () => {
    if (+page === 1) return;
    setSearchParam({ name: search, page: +page - 1, size: size });
  };

  const navigatePage = (page) => {
    if (!page) return;
    setSearchParam({ name: search, page: page, size: size });
  };

  const { data } = useQuery({
    queryKey: ["menus", query],
    queryFn: async () => {
      if (query.name === "") delete query.name;
      return await menuService.getAll(query);
    },
    onSuccess: (data) => {
      if (store !== data.data) {
        setStore(data.data);
        setPaging(data.paging);
        let a = [];
        for (let index = 0; index < data.data.length; index++) {
          a.push(0);
        }
        setImageIndex(a);
      }
    },
  });

  const fetchData = async () => {
    try {
      const customers = await customerService.getAll();
      setDataCustomer(customers);
      const tables = await tableService.getAll();
      setDataTable(tables);
      // const menus = await menuService.getAll();
      // setDataMenu(menus);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const clearForm = () => {
    clearErrors();
    reset();
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await transactionService.create(data);
      if (response && response.statusCode === 201) {
        clearForm();
        showSuccessToast(response.message);
      }
    } catch (err) {
      showErrorToast(err);
    }
  };

  return (
    <div className="d-flex">
      <div className="flex-fill p-3">
        <div className="p-4 shadow-sm rounded-2">
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="row">
              <div className="col-12">
                <select
                  className="form-select"
                  name="size"
                  id="size"
                  onChange={(e) => {
                    setSearchParam({
                      name: search,
                      page: page,
                      size: e.target.value,
                    });
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>
            </div>
            <form autoComplete="off">
              <input
                {...register("search")}
                placeholder="search"
                className="form-control"
                type="search"
                name="search"
                id="search"
                onChange={handleSearch}
              />
            </form>
          </div>

          <hr />
          <div className="table-responsive mt-4">
            <table className="table overflow-auto">
              <thead>
                <tr>
                  <th className="text-center">No</th>
                  <th className="text-center">Menu</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((menu, index) => (
                    <tr key={menu.menuId}>
                      <td className="text-center">
                        {index + 1 + +size * (+page - 1)}
                      </td>
                      <td className="d-flex align-items-center justify-content-center">
                        <div>
                          <div>
                            <button
                              onClick={() => {
                                if (imageIndex <= 0) return;
                                let s = imageIndex.slice();
                                s.splice(index, 1, imageIndex[index] - 1);
                                setImageIndex(s);
                              }}
                              disabled={imageIndex[index] === 0}
                              className="btn btn-outline-primary btn-sm"
                            >
                              <IconArrowBadgeLeft />
                            </button>
                            <img
                              className="img-fluid m-1"
                              width={200}
                              height={200}
                              src={
                                menu.imageResponses[imageIndex[index]] &&
                                menu.imageResponses[imageIndex[index]].url
                              }
                              alt={
                                menu.imageResponses[imageIndex[index]] &&
                                menu.imageResponses[imageIndex[index]].url
                              }
                            />
                            <button
                              disabled={
                                imageIndex[index] ===
                                menu.imageResponses.length - 1
                              }
                              onClick={() => {
                                if (
                                  imageIndex[index] >=
                                  menu.imageResponses.length - 1
                                )
                                  return;
                                let s = imageIndex.slice();
                                s.splice(index, 1, imageIndex[index] + 1);
                                setImageIndex(s);
                              }}
                              className="btn btn-outline-primary btn-sm"
                            >
                              <IconArrowBadgeRight />
                            </button>
                          </div>
                          <div className="justify-content-around d-flex align-items-center">
                            <div className="text-center">
                              <h6>{menu.menuName}</h6>{" "}
                              <span>Rp. {menu.menuPrice}</span>
                            </div>
                            <div>
                              <Cart
                                handleCart={(value) => {
                                  handleChangeCart({
                                    menuId: menu.menuId,
                                    menuName: menu.menuName,
                                    menuPrice: menu.menuPrice,
                                    menuQuantity: value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-4">
            <small>
              Show data {data && data.data?.length} of {paging.totalElement}
            </small>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li
                  className={`page-item ${
                    !paging.hasPrevious ? "disabled" : ""
                  }`}
                >
                  <button
                    disabled={!paging.hasPrevious}
                    onClick={handlePreviousPage}
                    className="page-link"
                  >
                    Previous
                  </button>
                </li>
                {[...Array(paging.totalPages)].map((_, index) => {
                  const currentPage = index + 1;
                  return (
                    <li
                      key={index}
                      className={`page-item ${
                        paging.page === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => navigatePage(currentPage)}
                        className="page-link"
                      >
                        {currentPage}
                      </button>
                    </li>
                  );
                })}
                <li
                  className={`page-item ${!paging.hasNext ? "disabled" : ""}`}
                >
                  <button
                    disabled={!paging.hasNext}
                    className="page-link"
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex-fill p-3">
        <div className="p-4">
          <div className="shadow-sm p-4 rounded-2">
            <h2 className="mb-4">Warung Makan Bahari</h2>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="mb-3">
                <label
                  htmlFor="transactionDate"
                  className="form-label required"
                >
                  Tanggal Transaksi
                </label>
                <input
                  {...register("transactionDate")}
                  type="date"
                  className={`form-control ${
                    errors.transactionDate && "is-invalid"
                  }`}
                  id="transactionDate"
                  name="transactionDate"
                />
                {errors.transactionDate && (
                  <div className="invalid-feedback">
                    {errors.transactionDate.message}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="customerId" className="form-label required">
                  Customer
                </label>
                {dataCustomer && (
                  <SearchDropdown
                    options={dataCustomer.data}
                    label="customerName"
                    id="customerId"
                    selectedVal={getValues("customerId")}
                    handleChange={(value) => {
                      setValue("customerId", value);
                      trigger("customerId");
                    }}
                    error={errors.customerId}
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="tableId" className="form-label">
                  Meja
                </label>
                {dataTable && (
                  <SearchDropdown
                    options={dataTable.data}
                    label="tableName"
                    id="tableId"
                    selectedVal={getValues("tableId")}
                    handleChange={(value) => {
                      setValue("tableId", value);
                      trigger("tableId");
                    }}
                  />
                )}
              </div>

              <div className="table-responsive mt-4">
                <table className="table overflow-auto">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Menu</th>
                      <th>SubTotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuCart.map((cart, index) => (
                      <tr key={cart.menuId}>
                        <td>{index + 1}</td>
                        <td>{cart.menuName}</td>
                        <td>Rp. {cart.menuPrice * cart.menuQuantity}</td>
                      </tr>
                    ))}
                    {menuCart.length !== 0 && (
                      <tr>
                      <td colSpan="2" className="text-start">
                        <b>GrandTotal &nbsp;</b>
                      </td>
                      <td>
                        {menuCart.reduce(
                          (sum, detail) =>
                            sum + detail.menuQuantity * detail.menuPrice,
                          0
                        )}
                      </td>
                    </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="d-flex align-items-center btn btn-primary"
                >
                  <i className="me-2">
                    <IconDeviceFloppy />
                  </i>
                  Simpan
                </button>
                <button
                  onClick={clearForm}
                  type="button"
                  className="d-flex align-items-center btn btn-danger text-white"
                >
                  <i className="me-2">
                    <IconX />
                  </i>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
