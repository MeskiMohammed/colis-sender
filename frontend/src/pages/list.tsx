import Button from "@/components/ui/button";
import api from "@/lib/api";
import { useCountry } from "@/providers/CountryProvider";
import type City from "@/types/city";
import { Map, PackageSearch, Printer, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Parcel, Recipient, Shipper } from "./add";
import DeleteModal from "@/components/deleteModal";
import toast from "react-hot-toast";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import { printList, printElement } from "@/lib/pdf";
import { useTranslation } from "react-i18next";

type StrippedOrder = {
  id: number;
  parcelCode: string;
  recipientName: string;
  recipientCity: { id: number; name: string };
  recipientPhoneCode: string;
  recipientPhone: string;
  shipper: { name: string; phone: string; phoneCode: string; city: { name: string } };
  status: string;
  productType: string;
  parcelNumber: string;
  date: string;
  nParcels: number;
  paid: boolean;
};

type Order = Recipient & Parcel & { id: number; pics: { url: string }[]; shipper: Shipper & { city: City }; recipientCity: City; status: string; parcelCode: string };

export default function List() {
  const [search, setSearch] = useState<{ str: string; date: string; cityId: string }>({ str: "", date: "", cityId: "" });
  const [cities, setCities] = useState<City[]>([]);
  const [orders, setOrders] = useState<StrippedOrder[]>([]);
  const [filtered, setFiltered] = useState<StrippedOrder[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
  const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);
  const [openStatusModalStatus, setOpenStatusModalStatus] = useState<string>("");
  const IdRef = useRef<number | null>(null);
  const { country } = useCountry();
  const { t } = useTranslation();

  async function fetchCities(country: "Morocco" | "France") {
    const res = await api.get("/cities/" + (country === "Morocco" ? "France" : "Morocco"));
    setCities(res.data);
  }

  async function fetchOrders(country: "Morocco" | "France") {
    const res = await api.get("/orders/country/" + country);
    setOrders(res.data);
  }

  function handleDelete(id: number) {
    IdRef.current = id;
    setOpenDeleteModal(true);
  }

  function handleShowDetails(id: number) {
    IdRef.current = id;
    setOpenDetailsModal(true);
  }

  function handleShowStatusModal(id: number, status: string) {
    IdRef.current = id;
    setOpenStatusModalStatus(status);
    setOpenStatusModal(true);
  }

  function closeModal() {
    IdRef.current = null;
    setOpenStatusModalStatus("");
    setOpenDeleteModal(false);
    setOpenDetailsModal(false);
    setOpenStatusModal(false);
  }

  function clearSearch() {
    setSearch({ str: "", date: "", cityId: "" });
  }

  async function deleteOrder() {
    await toast.promise(
      api.delete("/orders/" + IdRef.current),
      {
        loading: t("list.deleting_order"),
        success: t("list.order_deleted"),
        error: t("list.error_deleting_order"),
      },
      { id: "deleteOrder" }
    );
    closeModal();
    await fetchOrders(country);
  }

  useEffect(() => {
    (async () => {
      await Promise.all([fetchCities(country), fetchOrders(country)]);
    })();
    clearSearch();
  }, [country]);

  useEffect(() => {
    const searchText = search.str.toLowerCase();

    setFiltered(
      orders.filter((order) => {
        if (search.str) {
          const searchable = [order.parcelNumber, order.parcelCode, order.productType].filter(Boolean).join(" ").toLowerCase();
          if (!searchable.includes(searchText)) return false;
        }

        if (search.date) {
          const orderDate = new Date(order.date).toISOString().slice(0, 10);
          const searchDate = search.date;
          if (orderDate !== searchDate) {
            return false;
          }
        }

        if (search.cityId !== "" && order.recipientCity.id !== Number(search.cityId)) {
          return false;
        }

        return true;
      })
    );
  }, [search, orders]);

  return (
    <>
      <div className="space-y-2">
        <input type="text" placeholder={t("common.search")} value={search?.str} onChange={(e: any) => setSearch({ ...search, str: e.target.value })} className="w-full px-2 py-2 rounded-full border border-black focus:border-orange-600 focus:outline-0" />
        <div className="grid grid-cols-2 gap-2">
          <select onChange={(e: any) => setSearch({ ...search, cityId: e.target.value })} className="w-full focus:outline-0 text-center bg-white p-2 rounded-full border border-black">
            <option value="">{t("list.all_cities")}</option>
            {cities.map((city: City) => (
              <option key={"city-" + city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <div className="relative w-full border border-black rounded-full bg-white flex justify-center items-center">
            <input type="date" onChange={(e: any) => setSearch((prev) => ({ ...prev, date: e.target.value }))} id="date" className=" opacity-0 peer bg-transparent focus:outline-0 w-fit text-center rounded-full p-2" />
            <label htmlFor="date" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all">
              {search.date ? new Date(search.date).toLocaleDateString("fr-FR") : "dd/mm/yyyy"}
            </label>
          </div>
          {/* <input type="date" className="text-center w-full border border-black rounded-full" onChange={(e: any) => setSearch({ ...search, date: e.target.value })} value={search.date} /> */}
        </div>
        <Button disabled={!filtered.length} onClick={() => printList(filtered)} className="flex items-center gap-2 justify-center w-full rounded-full py-3">
          <Printer />
          {t("common.print")}
        </Button>
      </div>
      <br />
      <div className="space-y-2">
        {filtered.map((order, idx) => (
          <div key={"order" + idx} className="rounded-xl bg-white shadow-xl divide-y border ">
            <div className="px-4 py-2 flex justify-between items-center rounded-t-xl">
              <p>
                {t("list.parcel_code")}: {order.parcelCode}
              </p>
              <Trash2 className="text-red-600" onClick={() => handleDelete(order.id)} />
            </div>
            <div className="px-4 py-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <User size={18} className="text-gray-500" />
                <p>{order.shipper.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <p>{order.recipientName}</p>
                <User size={18} className="text-gray-500" />
              </div>
            </div>
            <div className="px-4 py-2 flex justify-between items-center gap-1 items-center">
              <div className="flex items-center gap-1">
                <Map size={18} className="text-gray-500" />
                <p>{order.shipper.city.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <p>{order.recipientCity.name}</p>
                <Map size={18} className="text-gray-500" />
              </div>
            </div>
            <div className="grid grid-cols-12">
              <Button className="rounded-none px-0 col-span-3 rounded-bl-xl rtl:rounded-bl-none rtl:rounded-br-xl flex gap-1 justify-center items-center" onClick={() => handleShowDetails(order.id)}>
                {t("list.details")}
              </Button>
              <Button onClick={() => handleShowStatusModal(order.id, order.status)} className="rounded-none col-span-6 flex gap-1 justify-center items-center bg-orange-600">
                <p>{t("list." + order?.status || "list.unknown")}</p>
                <PackageSearch />
              </Button>
              <Button className="rounded-none col-span-3 bg-green-600 rounded-br-xl rtl:rounded-br-none rtl:rounded-bl-xl flex gap-1 justify-center items-center">
                <a href={`https://api.whatsapp.com/send?phone=${order.recipientPhoneCode.slice(1)}${order.recipientPhone}`} target="_blank">
                  <svg fill="#ffffff" width="32px" height="32px" viewBox="-6.4 -6.4 44.80 44.80" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.00032">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>whatsapp</title>
                      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>{" "}
                    </g>
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
      {openStatusModal && <StatusModal open={openStatusModal} close={closeModal} orderId={IdRef.current as number} orderStatus={openStatusModalStatus} fetchOrders={fetchOrders} />}
      <DeleteModal open={openDeleteModal} close={closeModal} fn={deleteOrder} />
      {openDetailsModal && <OrderDetailsModal open={openDetailsModal} close={closeModal} orderId={IdRef.current as number} />}
    </>
  );
}

type Props = {
  open: boolean;
  close: () => void;
  orderId: number;
};

function OrderDetailsModal({ open, close, orderId }: Props) {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [order, setOrder] = useState<Order>();
  const [emblaRef] = useEmblaCarousel({ loop: false });
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const res = await api.get("/orders/" + orderId);
      setOrder(res.data);
    })();
    setOpenDelete(true);
  }, []);

  function closeModal() {
    setOpenDelete(false);
    setTimeout(close, 300);
  }

  const statusColors: Record<string, string> = {
    origin: "bg-gray-400",
    inStock: "bg-orange-400",
    inTransit: "bg-yellow-400",
    delivered: "bg-green-400",
    notDelivered: "bg-red-400",
    unknown: "bg-gray-400",
  };

  return (
    <>
      {open && (
        <div className={clsx("absolute inset-0 flex justify-center items-center duration-300", openDelete ? "bg-black/60" : "bg-black/0")}>
          <div className={clsx("py-4 w-5/6 max-h-[calc(100%/6*5.5)] bg-white rounded-xl shadow-xl flex flex-col duration-300", openDelete ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
            <div className="px-4 pb-1 flex justify-between items-center">
              <div className={clsx("text-xs py-1 px-2 rounded-full", order?.paid ? "bg-green-400" : "bg-red-400")}>{order?.paid ? t("list.paid") : t("list.unpaid")}</div>
              <div className="bg-purple-900 text-white px-2 py-1 rounded">{order?.parcelCode}</div>
              <div className={clsx("text-xs py-1 px-2 rounded-full", statusColors[order?.status || "unknown"])}>{t("list." + order?.status || "list.unknown")}</div>
            </div>
            <div className="overflow-y-auto ">
              <div className="px-4 pb-1 divide-y">
                <div className="flex justify-between items-center py-1">
                  <span>{t("list.parcel_number")}</span>
                  <span>{order?.parcelNumber}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-green-100">
                  <span>{t("list.name")}</span>
                  <span>{order?.recipientName}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-green-100">
                  <span>{t("list.cin")}</span>
                  <span>{order?.recipientCin}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-green-100">
                  <span>{t("list.phone")}</span>
                  <span dir="ltr">{order?.recipientPhoneCode + " " + order?.recipientPhone}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-green-100">
                  <span>{t("list.city")}</span>
                  <span>{order?.recipientCity.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-red-100">
                  <span>
                    {t("list.name")} {t("common.shipper")}
                  </span>
                  <span>{order?.shipper.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-red-100">
                  <span>
                    {t("list.cin")} {t("common.shipper")}
                  </span>
                  <span>{order?.shipper.cin}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-red-100">
                  <span>
                    {t("list.phone")} {t("common.shipper")}
                  </span>
                  <span dir="ltr">{order?.shipper.phoneCode + " " + order?.shipper.phone}</span>
                </div>
                <div className="flex justify-between items-center py-1 bg-red-100">
                  <span>
                    {t("list.city")} {t("common.shipper")}
                  </span>
                  <span>{order?.shipper.city.name}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{t("list.home_delivery")}</span>
                  <span>{order?.homeDelivery ? t("common.yes") : t("common.no")}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{t("list.paid_amount")}</span>
                  <span>{order?.paidAmount}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{t("list.number_parcels")}</span>
                  <span>{order?.nParcels}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{t("list.weight")}</span>
                  <span>{order?.weight}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>{t("list.product_type")}</span>
                  <span>{order?.productType}</span>
                </div>
              </div>
              <div className="px-4">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex rtl:flex-row-reverse -ml-8">
                    {order?.pics.map((pic, idx: number) => (
                      <div key={"pic-" + idx} className="flex-[0_0_100%] aspect-video flex justify-center items-center pl-8">
                        <img src={import.meta.env.VITE_PUBLIC_API_URL + pic.url} alt="pic" className="max-w-full max-h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="flex justify-between items-center gap-2 px-4">
              <Button onClick={() => printElement(order as Order)}>{t("common.print")}</Button>
              <Button onClick={() => navigate("/add", { state: order })} className="bg-orange-600">
                {t("common.edit")}
              </Button>
              <Button onClick={closeModal} className="bg-gray-600">
                {t("common.close")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusModal({ open, close, orderId, orderStatus, fetchOrders }: any) {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { t } = useTranslation();
  const [status, setStatus] = useState<string>(orderStatus);
  const statuses = ["origin", "inStock", "inTransit", "delivered", "notDelivered"];
  const { country } = useCountry();

  useEffect(() => {
    setOpenDelete(open);
  }, [open]);

  function closeModal() {
    setOpenDelete(false);
    setTimeout(close, 300);
  }

  async function handleUpdateStatus() {
    await toast.promise(api.put(`/orders/${orderId}/status`, { status }), {
      loading: t("list.updating_status"),
      success: t("list.status_updated"),
      error: t("list.error_updating_status"),
    });
    fetchOrders(country);
    closeModal();
  }

  return (
    <>
      {open && (
        <div className={clsx("absolute inset-0 flex justify-center items-center duration-300", openDelete ? "bg-black/60" : "bg-black/0")}>
          <div className={clsx("p-4 w-5/6 max-h-[calc(100%/6*4)] bg-white rounded-xl shadow-xl flex flex-col duration-300", openDelete ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
            <div className="space-y-2">
              {statuses.map((s) => (
                <div onClick={() => setStatus(s)} className={clsx("border rounded-xl text-center p-4 duration-300", s === status ? "border-orange-500 bg-orange-100" : "border-black")}>
                  {t("list." + s)}
                </div>
              ))}
            </div>
            <br />
            <div dir="ltr" className="flex justify-end items-center gap-2">
              <Button onClick={closeModal} className="bg-gray-600">
                {t("common.cancel")}
              </Button>
              <Button onClick={handleUpdateStatus} className="bg-orange-600">
                {t("common.save")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
