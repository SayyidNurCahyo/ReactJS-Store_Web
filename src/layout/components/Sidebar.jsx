import {IconDoorExit, IconHome2, IconUser, IconToolsKitchen2, IconDesk, IconShoppingCart} from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Sidebar({ isVisible, setVisible }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setVisible(window.innerWidth >= 800);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setVisible]);

  return (
    <div
      className={`bg-info text-white p-4 shadow ${
        isVisible ? "show-custom" : "hide-custom"
      }`}
    >
      <div className="font-logo text-center mb-5">
        <Link to="/" className="text-white text-decoration-none" href="/">
          <h2 className="fs-2">
          <b>Warung Makan Bahari</b>
          </h2>
        </Link>
        <h2 className="fs-6 my-4 font-primary fw-bold">Admin Dashboard <br />--Development</h2>
      </div>
      <nav>
        <ul className="d-flex flex-column gap-2 nav-list list-unstyled">
          <li className="cursor-pointer text-white">
            <Link
              className="text-white text-decoration-none"
              to="/"
            >
              <i className="me-3">
                <IconHome2 />
              </i>
              <span>Dashboard</span>
            </Link>
          </li>
          <hr />
          <li className="cursor-pointer text-white">
            <Link
              className="text-white text-decoration-none"
              to="/customer"
            >
              <i className="me-3">
                <IconUser />
              </i>
              <span>Customer</span>
            </Link>
          </li>
          <hr />
          <li className="cursor-pointer text-white">
            <Link
              className="text-white text-decoration-none"
              to="/menu"
            >
              <i className="me-3">
                <IconToolsKitchen2 />
              </i>
              <span>Menu</span>
            </Link>
          </li>
          <hr />
          <li className="cursor-pointer text-white">
            <Link
              className="text-white text-decoration-none"
              to="/table"
            >
              <i className="me-3">
                <IconDesk />
              </i>
              <span>Meja</span>
            </Link>
          </li>
          <hr />
          <li className="cursor-pointer text-white">
            <Link
              className="text-white text-decoration-none"
              to="/transaction"
            >
              <i className="me-3">
                <IconShoppingCart />
              </i>
              <span>Transaction</span>
            </Link>
          </li>
          <hr />
          <li
            data-bs-toggle="modal"
            data-bs-target="#logoutModal"
            className="cursor-pointer text-white"
          >
            <i className="me-3">
              <IconDoorExit />
            </i>
            <span>Logout</span>
          </li>
        </ul>
      </nav>

      <div className="modal fade" tabIndex={-1} id="logoutModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark">Logout</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-dark">Apakah yakin ingin logout?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
};
