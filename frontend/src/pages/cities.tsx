import { useEffect, useState } from "react";
import { useCountry } from "@/providers/CountryProvider";
import { t } from "i18next";
import { Trash2 } from "lucide-react";
import type City from "@/types/city";
import Button from "@/components/ui/button";
import api from "@/lib/api";

export default function Cities() {
  const [cities, setCities] = useState<City[]>([]);
  const { country } = useCountry();
  const [city, setCity] = useState<string>("");

  async function fetchCities(country: "Morocco" | "France") {
    try {
      const res = await api.get("/cities/" + country);
      setCities(res.data);
    } catch (err) {
      alert(JSON.stringify(err));
    }
  }

  async function addCity() {
    if (!city) return;
    try {
      await api.post("/cities", { name: city, country });
    } catch (err) {
      alert(JSON.stringify(err));
    } finally {
      setCity("");
      fetchCities(country);
    }
  }

  async function deleteCity(id: number) {
    try {
      await api.delete("/cities/" + id);
    } catch (err) {
      alert(JSON.stringify(err));
    } finally {
      fetchCities(country);
    }
  }

  useEffect(() => {
    fetchCities(country);
  }, [country]);

  return (
    <div>
      <div className="grid grid-cols-12 mb-8">
        <input type="text" placeholder={t("city.add_city")} value={city} onInput={(e: any) => setCity(e.target.value)} className="col-span-9 px-2 rounded-l-full border border-black focus:border-orange-600 focus:outline-0" />
        <Button onClick={addCity} className="rounded-r-full col-span-3">
          {t("city.add")}
        </Button>
      </div>
      <ul className="space-y-2">
        {cities.map((city: City) => (
          <li key={city.id} className="flex border border-black rounded-xl justify-between items-center">
            <span className="ml-2">{city.name}</span>
            <Button className="bg-red-600 aspect-square hover:bg-red-500 rounded-xl" onClick={() => deleteCity(city.id)}>
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
