import { Outlet } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
