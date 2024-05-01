import { Outlet } from "react-router-dom";

export default function Transaction() {
  return (
    <>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
