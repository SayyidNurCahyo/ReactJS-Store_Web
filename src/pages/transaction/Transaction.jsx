import { useMemo } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TransactionService from "../../services/TransactionService";
import { Link } from "react-router-dom";
import { IconPlus, IconListDetails } from "@tabler/icons-react";
import Loading from "../../shared/loading/Loading";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";

export default function Transaction() {
  const { register } = useForm();
  const [searchParam, setSearchParam] = useSearchParams();
  const transactionService = useMemo(() => TransactionService(), []);
  const [transDetails, setTransDetails] = useState([]);

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

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", query],
    queryFn: async () => {
      return await transactionService.getAll(query);
    },
    onSuccess: (data) => {
      setPaging(data.paging);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="p-4">
        <div className="p-4 shadow-sm rounded-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Daftar Transaksi</h3>
            <Link className="btn btn-primary" to="/">
              <i className="me-2">
                <IconPlus />
              </i>
              Tambah Transaksi
            </Link>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="row">
              <div className="col-12">
                <select
                  className="form-select"
                  name="size"
                  id="size"
                  onChange={(e) => {
                    setSearchParam({
                      page: page,
                      size: e.target.value,
                    });
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
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
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Customer</th>
                  <th>Meja</th>
                  <th>Detail</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((transaction, index) => (
                    <tr key={transaction.transactionId}>
                      <td>{index + 1 + +size * (+page - 1)}</td>
                      <td>{transaction.transactionDate}</td>
                      <td>{transaction.customerName}</td>
                      <td>{transaction.table}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary text-white"
                          data-bs-toggle="modal"
                          data-bs-target="#detailModal"
                          onClick={() =>
                            setTransDetails(transaction.transactionDetails)
                          }
                        >
                          <IconListDetails />
                        </button>
                      </td>
                      <td>{transaction.transactionStatus}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="modal fade" id="detailModal" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Detail Transaksi</h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table overflow-auto">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Menu</th>
                        <th>Kuantitas</th>
                        <th>Harga</th>
                        <th>SubTotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transDetails.map((detail, index) => (
                        <tr key={detail.detailId}>
                          <td>{index + 1}</td>
                          <td>{detail.menu}</td>
                          <td>{detail.menuQuantity}</td>
                          <td>{detail.menuPrice}</td>
                          <td>{detail.menuQuantity * detail.menuPrice}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4" className="text-end">
                          <b>GrandTotal &nbsp;</b>
                        </td>
                        <td>
                          {transDetails.reduce(
                            (sum, detail) =>
                              sum + detail.menuQuantity * detail.menuPrice,
                            0
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
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
    </>
  );
}
