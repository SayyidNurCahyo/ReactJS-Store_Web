import PropTypes from "prop-types";

function Toast({ message, color }) {
  return (
    <div
      className={`position-absolute toast show top-25 end-0 me-4 mt-3 align-items-center text-bg-${color} text-white border-0`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string,
  color: PropTypes.string,
};

export default Toast;