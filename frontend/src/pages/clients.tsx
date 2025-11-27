import DeleteModal from "@/components/deleteModal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import api from "@/lib/api";
import { useCountry } from "@/providers/CountryProvider";
import type City from "@/types/city";
import type Client from "@/types/client";
import axios from "axios";
import clsx from "clsx";
import { Pen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type Country = {
  code: string;
  name: string;
  phone_code: string;
  flag: string;
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [client, setClient] = useState<Partial<Client>>({} as Partial<Client>);
  const [cities, setCities] = useState<City[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const { country } = useCountry();
  const {t} = useTranslation()


  async function fetchClients(country: "Morocco" | "France") {
    const res = await api.get("/clients/country/" + country);
    setClients(res.data);
  }

  async function fetchCities(country: "Morocco" | "France") {
    const res = await api.get("/cities/" + country);
    setCities(res.data);
  }

  function handleEdit(client: Client) {
    setEditing(true);
    setClient(client);
    setOpen(true);
  }

  async function save() {
    if (editing) {
      if (!client.id) {
        toast.error(t("common.error"));
        return;
      }
      await toast.promise(api.put("/clients/" + client.id, { ...client, country }), {
        loading: t("common.saving"),
        success: t("common.saved"),
        error: t("common.save_error"),
      });
    } else {
      await toast.promise(api.post("/clients", { ...client, country }), {
        loading: t("common.adding"),
        success: t("common.added"),
        error: t("common.add_error"),
      });
    }
    fetchClients(country);
    closeModal();
  }

  function handleDelete(id: number) {
    if (!id) {
      alert("no id");
      return;
    }
    setClient({ id } as Partial<Client>);
    setOpenDelete(true);
  }

  async function deleteClient() {
    try {
      await toast.promise(api.delete("/clients/" + client.id), {
        loading: t("common.deleting"),
        success: t("common.deleted"),
        error: t("common.delete_error"),
      });
      fetchClients(country);
    } catch (err) {
    } finally {
      closeModal();
    }
  }

  function closeModal() {
    setOpen(false);
    setOpenDelete(false);
    setEditing(false);
    setClient({phoneCode: country === "Morocco" ? "+212" : "+33"} as Partial<Client>);
  }

  useEffect(() => {
    (async () => {
      await Promise.all([fetchClients(country), fetchCities(country)]);
    })();
    setClient({phoneCode: country === "Morocco" ? "+212" : "+33"})
  }, [country]);

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>{t("client.create")}</Button>
      </div>
      <br />
      <ul className="space-y-2">
        {clients.map((client: Client,idx:number) => (
          <li key={"client"+idx} className="flex bg-white rounded-xl border shadow-lg">
            <div className="grid grid-cols-3 flex-1 p-4">
              <span>{t("client.name")}:</span>
              <span className="col-span-2">{client.name}</span>
              <span>{t("client.phone")}:</span>
              <span className="col-span-2 text-start" dir="ltr">{client.phoneCode+" "+client.phone}</span>
              <span>{t("client.cin")}:</span>
              <span className="col-span-2">{client.cin}</span>
              <span>{t("city.city")}:</span>
              <span className="col-span-2">{client.city.name}</span>
              <span>{t("client.address")}:</span>
              <span className="col-span-2">{client.address}</span>
            </div>
            <div className="grid grid-cols-1">
              <Button onClick={() => handleEdit(client)} className="bg-orange-600 rounded-none rounded-tr-xl rtl:rounded-tr-none rtl:rounded-tl-xl">
                <Pen />
              </Button>
              <Button onClick={() => handleDelete(client.id)} className="bg-red-600 rounded-none rounded-br-xl rtl:rounded-br-none rtl:rounded-bl-xl">
                <Trash2 />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Modal editing={editing} client={client} setClient={setClient} cities={cities} open={open} close={closeModal} save={save} />
      <DeleteModal open={openDelete} close={closeModal} fn={deleteClient} />
    </>
  );
}

type ModalProps = {
  editing: boolean;
  client: Partial<Client>;
  setClient: (client: Partial<Client>) => void;
  cities: City[];
  open: boolean;
  close: () => void;
  save: () => void;
};

function Modal({ editing, client, setClient, cities, open, close, save }: ModalProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const {t} = useTranslation()



  useEffect(() => {
    setOpenModal(open);
  }, [open]);

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://country-api.drnyeinchan.com/v1/countries");
      setCountries(res.data);
    })();
  }, []);

  function closeModal() {
    setOpenModal(false);
    setTimeout(close, 300);
  }

  return (
    <>
      {open && (
        <div className={clsx("absolute inset-0 flex justify-center items-center duration-300", openModal ? "bg-black/60" : "bg-black/0")}>
          <div className={clsx("py-4 w-5/6 max-h-[calc(100%/6*4)] bg-white rounded-xl shadow-xl flex flex-col duration-300", openModal ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
            <div className="px-4">{editing ? t("client.edit") : t("client.create")}</div>
            <br />
            <div className="overflow-y-auto space-y-4 px-4">
              <div className="flex flex-col">
                <label>{t("client.name")}</label>
                <Input type="text" value={client.name} onChange={(e: any) => setClient({ ...client, name: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <label>{t("client.phone")}</label>
                <div className="flex border border-gray-300 rounded group flex-1 w-full">
                  <select onChange={(e: any) => setClient({ ...client, phoneCode: e.target.value })} className="w-28 bg-white px-2 focus:outline-none" value={client.phoneCode}>
                    {countries.map((country, idx: number) => {
                      return (
                        country.phone_code && (
                          <option value={country.phone_code} key={idx}>
                            {country.flag} {country.phone_code}
                          </option>
                        )
                      );
                    })}
                  </select>
                  <input type="number" value={client.phone} onChange={(e: any) => setClient({ ...client, phone: e.target.value })} className="w-full h-10 focus:outline-none px-2 group-focus:border-black" />
                </div>
              </div>
              <div className="flex flex-col">
                <label>{t("city.city")}</label>
                <select value={client.cityId} onChange={(e: any) => setClient({ ...client, cityId: Number(e.target.value) })} className="h-10 bg-white focus:outline-0 focus:border-black rounded border border-gray-300 px-2">
                  <option value={undefined}>{t("common.select_city")}</option>
                  {cities.map((city: City) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label>{t("client.address")}</label>
                <Input type="text" value={client.address} onChange={(e: any) => setClient({ ...client, address: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <label>{t("client.cin")}</label>
                <Input type="text" value={client.cin} onChange={(e: any) => setClient({ ...client, cin: e.target.value.toUpperCase() })} />
              </div>
            </div>
            <br />
            <div className="flex justify-end items-center gap-2 px-4">
              <Button onClick={closeModal} className="bg-gray-600">
                {t("common.cancel")}
              </Button>
              <Button onClick={save}>{editing ? t("common.save") : t("common.add")} </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
