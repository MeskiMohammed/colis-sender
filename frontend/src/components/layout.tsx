import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function Layout() {
  return (
    <>
      <Sidebar />
      <main className="absolute inset-0 bg-background overflow-hidden">
        <Navbar/>
        <Outlet />
      </main>
    </>
  );
}
