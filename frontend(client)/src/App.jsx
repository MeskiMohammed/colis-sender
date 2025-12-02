import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Navbar from "./components/navbar";

export default function App() {
  const [parcelCode, setParcelCode] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  async function search(e) {
    e.preventDefault();
    setOrder(null);
    setError(null);
    if (parcelCode.length < 10) {
      setError("code_error");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_PUBLIC_API_URL}/orders/code/${parcelCode}`);
      let obj = res.data;
      obj.statuses.forEach((status) => {
        const [date, time] = status.date.split("T");
        const [year, month, day] = date.split("-");
        const [hours, minutes] = time.split(":");
        status.date = `${day}/${month}/${year.slice(2)}`;
        status.time = `${hours}:${minutes}`;
      });
      setOrder(obj);
      setError(null);
    } catch (error) {
      setError("code_error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-screen min-h-screen flex flex-col bg-blue-100">
      <Navbar />
      <div className="py-6 space-y-12 flex flex-col items-center">
        <h1 className="text-4xl px-4">{t("title")}</h1>
        <div className="sm:w-8/12 w-11/12 space-y-2">
          <form onSubmit={search} className="space-y-2">
            <label className="text-lg">{t("parcel_code")}</label>
            <input value={parcelCode} onChange={(e) => setParcelCode(e.target.value)} type="text" dir="ltr" className="rounded text-center border border-blue-500 w-full p-2 focus:outline-blue-500 focus:outline-2" />
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white rounded p-2" disabled={loading}>
                {t("search")}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500">{t(error)}</p>}
        </div>
        <div className="sm:w-8/12 w-11/12">
          <Status order={order} />
        </div>
      </div>
    </main>
  );
}

const colors = {
  origin: "bg-gray-500",
  inStock: "bg-orange-400",
  inTransit: "bg-yellow-500",
  delivered: "bg-green-500",
  notDelivered: "bg-red-500",
};

function Status({ order }) {
  const { t } = useTranslation();
  return (
    order && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="bg-white rounded-2xl p-2">
          <div className="grid grid-cols-2 bg-gray-300 rounded-full text-center">
            <div className="p-1">{t("status")}</div>
            <div className={`p-1 text-white rounded-full font-semibold ${colors[order.statuses[0].name]}`}>{t(order.statuses[0].name)}</div>
          </div>
          <br />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="text-center border border-black rounded">
              <p className="font-semibold">{t("weight")}:</p>
              <p>{order.weight}kg</p>
            </div>
            <div className="text-center border border-black rounded">
              <p className="font-semibold">{t("product_type")}:</p>
              <p>{order.productType}</p>
            </div>
            <div className="text-center border border-black rounded">
              <p className="font-semibold">{t("parcels_number")}:</p>
              <p>{order.nParcels}</p>
            </div>
            <div className="text-center border border-black rounded">
              <p className="font-semibold">{t("paid")}:</p>
              <p>{order.paid ? t("yes") : t("no")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-2 space-y-2">
          {order.statuses.map((status) => (
            <div key={status.name} className="flex items-center gap-2">
              <p className="w-16">{status.date}</p>
              <div className="flex text-center items-center bg-gray-300 rounded-full">
                <p className="w-16">{status.time}</p>
                <p className={`text-white px-2 py-1 rounded-full ${colors[status.name]}`}>{t(status.name)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
