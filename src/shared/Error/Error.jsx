import errorImage from "../../assets/error.svg";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100dvh" }}
    >
      <h2>Terjadi Kesalahan pada Server</h2>
      <img
        src={errorImage}
        alt="server-error"
        className="img-fluid my-4"
        width={600}
      />
      <div>
        <Link to="/" className="btn btn-primary">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
