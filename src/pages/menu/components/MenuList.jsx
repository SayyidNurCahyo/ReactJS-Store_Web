import { useMemo } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import MenuService from "../../../services/MenuService";
import { useEffect } from "react";
import Toast from "../../../shared/toast/Toast";
import { Link } from "react-router-dom";
import { IconEditCircle, IconTrash } from "@tabler/icons-react";

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const { register } = useForm();
  const [searchParam, setSearchParam] = useSearchParams();
  const menuService = useMemo(() => MenuService(), []);
  const [showToast, setShowToast] = useState(false);

  const search = searchParam.get("name" || "");
  const page = searchParam.get("page") || "1";
  const size = searchParam.get("size") || "5";

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
    if (value === "") setSearchParam({ page: "1", size: "5" });
    else setSearchParam({ name: value, page: "1", size: "5" });
  };

  const handleNextPage = () => {
    if (page >= paging.totalPages) return;
    setSearchParam({ page: +page + 1, size: size });
  };

  const handlePreviousPage = () => {
    if (+page === 1) return;
    setSearchParam({ page: +page - 1, size: size });
  };

  const navigatePage = (page) => {
    if (!page) return;
    setSearchParam({ page: page, size: size });
  };

  const handleDelete = async (id) => {
    if (!confirm("apakah yakin menghapus menu ini?")) return;
    try {
      const response = await MenuService.deleteById(id);
      if (response.statusCode === 200) {
        const data = await MenuService.getAll();
        setMenus(data.data);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (showToast === true) Toast("Menu berhasil dihapus", "danger");
    const getMenus = async () => {
      try {
        const data = await MenuService.getAll({
          name: search,
          page: page,
          size: size,
        });
        setMenus(data.data);
        setPaging(data.paging);
      } catch (err) {
        console.log(err);
      }
    };
    getMenus();
  }, [menuService, page, search, searchParam, size, showToast]);

  return (
    <div className="p-4 shadow-sm rounded-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Daftar Menu</h3>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="row">
          <div className="col-12">
            <select
              className="form-select"
              name="size"
              id="size"
              onChange={(e) => {
                setSearchParam({ q: search, page: page, size: e.target.value });
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
              <th>Harga</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu, index) => (
              <tr key={menu.menuId}>
                <td>{index+1+((+size)*((+page)-1))}</td>
                <td>{menu.menuName}</td>
                <td>{menu.menuPrice}</td>
                <td>
                  {menu.ImageResponses.map((image, index) => (
                    <div className="row">
                    <div className="col-md-4">
                    <img
                    className="img-fluid"
                    width={100}
                    height={100}
                    src={menu.imageResponses.url}
                    alt={menu.imageResponses.name}
                  />
                    </div>
                </div>
                  ))}
                </td>
                <td>
                  <div className="btn-group">
                    <Link
                      to={`/Menu/update/${Menu.MenuId}`}
                      className="btn btn-primary"
                    >
                      <i>
                        <IconEditCircle />
                      </i>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger text-white"
                      //   data-bs-toggle="modal"
                      //   data-bs-target="#deleteModal"
                      onClick={() => handleDelete(Menu.MenuId)}
                    >
                      <IconTrash />
                    </button>
                    {/* <div
                      className="modal fade"
                      id="deleteModal"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5">
                              Konfirmasi Hapus Menu
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            Apakah anda yakin ingin menghapus Menu ini?
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
                              onClick={() => handleDelete(Menu.MenuId)}
                              data-bs-dismiss="modal"
                              className="btn btn-danger text-white"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-4">
        <small>
          Show data {Menus.length} of {paging.totalElement}
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
