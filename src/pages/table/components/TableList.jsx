import { useMemo } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import TableService from "../../../services/TableService";
// import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IconEditCircle, IconTrash, IconPlus } from "@tabler/icons-react";
// import Loading from "../../../shared/loading/Loading";
import { showErrorToast, showSuccessToast } from "../../../utils/ToastUtil";
import { useQuery } from "react-query";

export default function TableList() {
  const [tableId, setTableId] = useState();
  const { register } = useForm();
  const [searchParam, setSearchParam] = useSearchParams();
  const tableService = useMemo(() => TableService(), []);

  const search = searchParam.get("name") || "";
  const page = searchParam.get("page") || "1";
  const size = searchParam.get("size") || "5";
  const query = {name: search, page: page, size: size}

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
    // if (value === "") setSearchParam({ page: "1", size: "5" });
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

  const handleDelete = async (id) => {
    try {
      const response = await tableService.deleteById(id);
      showSuccessToast(response.message);
      refetch();
    } catch (err) {
      showErrorToast(err);
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["tables", query],
    queryFn: async () => {
      if(query.name === '') delete query.name
      return await tableService.getAll(query)
    },
    onSuccess: (data) => {
      setPaging(data.paging);
    },
  });

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <div className="p-4 shadow-sm rounded-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Daftar Meja</h3>
        <Link className="btn btn-primary" to="/table/new">
          <i className="me-2">
            <IconPlus />
          </i>
          Tambah Meja
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
                  name: search,
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
              <th>Nama</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.data.map((table, index) => (
                <tr key={table.tableId}>
                  <td>{index + 1 + +size * (+page - 1)}</td>
                  <td>{table.tableName}</td>
                  <td>
                    <div className="btn-group">
                      <Link
                        to={`/table/update/${table.tableId}`}
                        className="btn btn-primary"
                      >
                        <i>
                          <IconEditCircle />
                        </i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger text-white"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => setTableId(table.tableId)}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="deleteModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Konfirmasi Hapus Meja</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Apakah anda yakin ingin menghapus meja ini?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(tableId)}
                data-bs-dismiss="modal"
                className="btn btn-danger text-white"
              >
                Hapus
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
              className={`page-item ${!paging.hasPrevious ? "disabled" : ""}`}
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
            <li className={`page-item ${!paging.hasNext ? "disabled" : ""}`}>
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
  );
}
