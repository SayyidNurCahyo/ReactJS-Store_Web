import Lottie from "lottie-react";
import loading from "../../assets/loading.json";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center">
      <span style={{ width: 256 }}>
        <Lottie animationData={loading} />
      </span>
    </div>
  );
}
