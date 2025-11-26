import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function Layout() {
  return (
    <>
      <Sidebar />
      <div className="absolute flex flex-col inset-0 bg-background overflow-hidden">
        <Navbar/>
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}
