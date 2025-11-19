import { SidebarTrigger } from "./sidebar";

export default function Navbar() {
  return <nav className="w-full h-16 bg-primary flex justify-between items-center rounded-b-xl px-8 text-white">
        <SidebarTrigger/>
        Navbar
    </nav>;
}
