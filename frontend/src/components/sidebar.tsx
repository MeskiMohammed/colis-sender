import { useCountry } from "@/providers/CountryProvider";
import { t } from "i18next";
import { Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
	const {country, setCountry} = useCountry();
  const sidebarRef = useRef<HTMLElement>(document.getElementById("sidebar"));

  useEffect(() => {
    sidebarRef.current = document.getElementById("sidebar");
  }, []);

  function closeSidebar() {
    if (sidebarRef.current) {
      sidebarRef.current.dataset.active = "false";
    }
  }

  return (
    <aside data-active="false" id="sidebar" className="absolute p-8 z-10 inset-0 bg-blue-800 text-white font-semibold -translate-x-[100%] data-[active=true]:translate-x-0 transition-transform duration-300">
      <div className="flex justify-end" onClick={closeSidebar}>
        <X />
      </div>
			<br />
			<div className="relative grid grid-cols-2 p-1 bg-white rounded">
				<div className="absolute p-1 h-full w-full">
					<div data-country={country} className="bg-primary h-full rounded w-1/2 translate-x-[100%] data-[country=morocco]:translate-x-0 transition-transform duration-300" />
				</div>
				<div data-country={country} className="rounded relative text-black data-[country=morocco]:text-white z-10 py-2 px-4 text-center text-sm transition-color duration-300" onClick={()=>setCountry('morocco')}>{t('sidebar.maf')}</div>
				<div data-country={country} className="rounded relative text-black data-[country=france]:text-white  z-10 py-2 px-4 text-center text-sm transition-color duration-300" onClick={()=>setCountry('france')}>{t('sidebar.fam')}</div>
			</div>
      <ul className="flex flex-col items-center text-2xl gap-6 py-8">
        <li><Link to='/add'>{t('sidebar.add')}</Link></li>
        <li><Link to='/list'>{t('sidebar.list')}</Link></li>
        <li><Link to='/clients'>{t('sidebar.clients')}</Link></li>
        <li><Link to='/cities'>{t('sidebar.cities')}</Link></li>
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
  return <button onClick={openSidebar}>
		<Menu />
	</button>;
}
