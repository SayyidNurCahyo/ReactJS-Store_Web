import { Outlet } from "react-router-dom";

export default function Customer() {
  return (
    <>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
