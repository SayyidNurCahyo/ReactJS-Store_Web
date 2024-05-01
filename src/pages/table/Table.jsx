import { Outlet } from "react-router-dom";

export default function Table() {
  return (
    <>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
