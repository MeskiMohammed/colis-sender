import { useEffect, useState } from "react";
import { useCountry } from "@/providers/CountryProvider";
import { t } from "i18next";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type City from "@/types/city";
import DeleteModal from "@/components/deleteModal";

export default function Cities() {
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<Partial<City>>({});
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { country } = useCountry();

  async function fetchCities(country: "Morocco" | "France") {
    try {
      const res = await api.get("/cities/" + country);
      setCities(res.data);
    } catch (err) {}
  }

  async function addCity() {
    if (!city.name) {
      toast.error(t("city.city_empty"), { id: "city_add" });
      return;
    }
    await toast.promise(
      api.post("/cities", { ...city, country }),
      {
        loading: t("common.adding"),
        success: t("common.added"),
        error: t("common.add_error"),
      },
      { id: "city_add" }
    );
    setCity({});
    fetchCities(country);
  }

  function handleDelete(id: number) {
    if (!id) {
      toast.error(t("common.error"), { id: "city_error" });
      return;
    }
    setCity({ id });
    setOpenDelete(true);
  }

  async function deleteCity() {
    await toast.promise(
      api.delete("/cities/" + city.id),
      {
        loading: t("common.deleting"),
        success: t("common.deleted"),
        error: t("common.delete_error"),
      },
      { id: "city_delete" }
    );
    fetchCities(country);
    closeModal();
  }

  function closeModal() {
    setOpenDelete(false);
    setCity({});
  }

  useEffect(() => {
    fetchCities(country);
  }, [country]);

  return (
    <>
      <div>
        <div className="grid grid-cols-12 mb-8">
          <input type="text" placeholder={t("city.add_city")} value={city.name} onChange={(e: any) => setCity({ ...city, name: e.target.value })} className="col-span-9 px-2 rounded-l-full border border-black focus:border-orange-600 focus:outline-0" />
          <Button onClick={addCity} className="rounded-r-full col-span-3">
            {t("common.add")}
          </Button>
        </div>
        <ul className="space-y-2">
          {cities.map((city: City) => (
            <li key={city.id} className="flex border border-black rounded-xl justify-between items-center">
              <span className="ml-2">{city.name}</span>
              <Button className="bg-red-600 aspect-square hover:bg-red-500 rounded-xl" onClick={() => handleDelete(city.id)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <DeleteModal open={openDelete} close={closeModal} fn={deleteCity} />
    </>
  );
}
