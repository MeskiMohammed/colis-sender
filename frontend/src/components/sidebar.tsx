import { useCountry } from "@/providers/CountryProvider";
import { Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { country, setCountry } = useCountry();
  const sidebarRef = useRef<HTMLElement>(document.getElementById("sidebar"));
  const {t} = useTranslation()

  const links: [string, string][] = [
    ["/add", t("sidebar.add")],
    ["/list", t("sidebar.list")],
    ["/clients", t("sidebar.clients")],
    ["/cities", t("sidebar.cities")],
  ];

  useEffect(() => {
    sidebarRef.current = document.getElementById("sidebar");
  }, []);

  function closeSidebar() {
    if (sidebarRef.current) {
      sidebarRef.current.dataset.active = "false";
    }
  }

  return (
    <aside data-active="false" id="sidebar" className="absolute p-4 z-10 inset-0 bg-blue-800 text-white font-semibold -translate-x-[100%] rtl:translate-x-[100%] data-[active=true]:translate-x-0 data-[active=true]:rtl:-translate-x-0 transition-transform duration-300">
      <div className="flex justify-end" onClick={closeSidebar}>
        <X />
      </div>
      <br />
      <div className="relative grid grid-cols-2 p-1 bg-white rounded">
        <div className="absolute p-1 h-full w-full">
          <div data-country={country} className="bg-primary h-full rounded w-1/2 translate-x-[100%] rtl:-translate-x-[100%] data-[country=Morocco]:translate-x-0 data-[country=Morocco]:rtl:-translate-x-0 transition-transform duration-300" />
        </div>
        <div data-country={country} className="rounded relative text-black data-[country=Morocco]:text-white z-10 py-2 px-4 text-center text-sm transition-color duration-300" onClick={() => setCountry("Morocco")}>
          {t("sidebar.maf")}
        </div>
        <div data-country={country} className="rounded relative text-black data-[country=France]:text-white  z-10 py-2 px-4 text-center text-sm transition-color duration-300" onClick={() => setCountry("France")}>
          {t("sidebar.fam")}
        </div>
      </div>
      <ul className="flex flex-col items-center text-2xl gap-6 py-8">
        {links.map((link: [string, string]) => (
          <li key={link[0]}>
            <Link onClick={closeSidebar} to={link[0]}>
              {link[1]}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function SidebarTrigger() {
  const sidebarRef = useRef<HTMLElement>(document.getElementById("sidebar"));

  useEffect(() => {
    sidebarRef.current = document.getElementById("sidebar");
  }, []);

  function openSidebar() {
    if (sidebarRef.current) {
      sidebarRef.current.dataset.active = "true";
    }
  }
  return (
    <button onClick={openSidebar}>
      <Menu />
    </button>
  );
}
