import Button from "@/components/ui/button";
import api from "@/lib/api";
import { useCountry } from "@/providers/CountryProvider";
import type City from "@/types/city";
import { t } from "i18next";
import { Printer, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function List() {
  const [search, setSearch] = useState<Partial<{ str: string; cityId: number | null }>>({});
  const [cities, setCities] = useState<City[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const { country } = useCountry();

  async function fetchCities(country: "Morocco" | "France") {
    try {
      const res = await api.get("/cities/" + (country==="Morocco"?"France":"Morocco"));
      setCities(res.data);
    } catch (err) {}
  }

  useEffect(() => {
    fetchCities(country);
  }, [country]);

  return (
    <>
      <div className="space-y-2">
        <div className="grid grid-cols-12">
          <input type="text" placeholder={t("common.search")} value={search?.str} onChange={(e: any) => setSearch({ ...search, str: e.target.value })} className="col-span-10 px-2 rounded-l-full border border-black focus:border-orange-600 focus:outline-0" />
          <Button onClick={() => {}} className="rounded-r-full col-span-2">
            <Search />
          </Button>
        </div>
        <select onChange={(e:any)=>setSearch({...search,cityId:e.target.value})} className="w-full bg-white p-2 rounded-full border border-black">
          <option value=''>{t("list.all_cities")}</option>
          {cities.map((city: City) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <Button className="flex items-center gap-2 justify-center w-full rounded-full py-3">
          <Printer />
          {t("common.print")}
        </Button>
      </div>
    </>
  );
}
