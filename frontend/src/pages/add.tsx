import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import api from "@/lib/api";
import { useCountry } from "@/providers/CountryProvider";
import type City from "@/types/city";
import type Client from "@/types/client";
import axios from "axios";
import clsx from "clsx";
import { Eye, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, CameraResultType } from "@capacitor/camera";

export type Shipper = {
  id?: number;
  name: string;
  cin: string;
  phone: string;
  phoneCode: string;
  cityId: number | undefined;
  country: string;
  address: string;
};

export type Recipient = {
  recipientName: string;
  recipientCin: string;
  homeDelivery: boolean;
  recipientCityId: number | undefined;
  recipientPhone: string;
  recipientPhoneCode: string;
};

export type Parcel = {
  parcelNumber: string;
  paid: boolean;
  paidAmount: number;
  nParcels: number;
  productType: string;
  weight: number;
};

type Country = {
  code: string;
  name: string;
  phone_code: string;
  flag: string;
};

type Order = Recipient & Parcel & { id: number; pics: { url: string }[]; shipper: Shipper & { city: City }; recipientCity: City; status: string; parcelCode: string };

export default function Add() {
  const { country } = useCountry();
  const [shipper, setShipper] = useState<Shipper>({ name: "", cin: "", phone: "", phoneCode: "", cityId: undefined, country: country, address: "" });
  const [recipient, setRecipient] = useState<Recipient>({ recipientName: "", recipientCin: "", homeDelivery: true, recipientCityId: undefined, recipientPhone: "", recipientPhoneCode: "" });
  const [parcel, setParcel] = useState<Parcel>({ parcelNumber: "", paid: false, paidAmount: 0, nParcels: 1, productType: "", weight: 0 });
  const [pics, setPics] = useState<File[]>([]);
  const [cities, setCities] = useState<{ Morocco: City[]; France: City[] }>({ Morocco: [], France: [] });
  const [countries, setCountries] = useState<Country[]>([]);
  const [openClientsModal, setOpenClientsModal] = useState<boolean>(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [picIdx, setPicIdx] = useState<number | null>(null);
  const { state: order }: { state: Order } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (order) {
      setShipper(order.shipper);
      setRecipient({
        recipientName: order.recipientName,
        recipientCin: order.recipientCin,
        homeDelivery: order.homeDelivery,
        recipientCityId: order.recipientCityId,
        recipientPhone: order.recipientPhone,
        recipientPhoneCode: order.recipientPhoneCode,
      });
      setParcel({
        parcelNumber: order.parcelNumber,
        paid: order.paid,
        paidAmount: order.paidAmount,
        nParcels: order.nParcels,
        productType: order.productType,
        weight: order.weight,
      });
      setPreviews(order.pics.map((pic) => import.meta.env.VITE_PUBLIC_API_URL + pic.url));
      setPics([]);
    }
  }, []);

  async function handleSaveOrder() {
    if (!checkShipper() || !checkRecipient() || !checkParcel()) {
      toast.error(t("add.error_empty_fields"), { id: "empty" });
      return;
    }
    let id;
    if (shipper.id === undefined) {
      const res = await api.post("clients", shipper);
      id = res.data.id;
    } else {
      id = shipper.id;
    }

    if (order) {
      const deletedPics = order.pics.filter((pic) => !previews.includes(import.meta.env.VITE_PUBLIC_API_URL + pic.url));

      await Promise.all([
        toast.promise(
          api.put("/orders/" + order.id, { shipperId: id, ...recipient, ...parcel }),
          {
            loading: t("common.saving"),
            success: () => {
              clearShipper();
              clearRecipient();
              clearParcel();
              return t("common.saved");
            },
            error: t("common.save_error"),
          },
          { id: "add_order" }
        ),
        await handleSavePics(order.id),
        await handleDeletePics(deletedPics.map((pic: any) => pic.id)),
      ]);
      clearPics();
    } else {
      const res = await toast.promise(
        api.post("/orders", { shipperId: id, ...recipient, ...parcel }),
        {
          loading: t("common.added"),
          success: () => {
            clearShipper();
            clearRecipient();
            clearParcel();
            return t("common.adding");
          },
          error: t("common.add_error"),
        },
        { id: "add_order" }
      );

      await handleSavePics(res.data.id);
      clearPics();
    }
    navigate("/list");
  }

  function checkShipper() {
    const keys: (keyof Shipper)[] = ["name", "cin", "phone", "phoneCode", "cityId", "country", "address"];
    for (const k of keys) {
      if (!shipper[k]) return false;
    }
    return true;
  }
  function checkRecipient() {
    const keys: (keyof Recipient)[] = ["recipientName", "recipientCin", "recipientCityId", "recipientPhone", "recipientPhoneCode"];
    for (const k of keys) {
      if (!recipient[k]) return false;
    }
    return true;
  }
  function checkParcel() {
    const keys: (keyof Parcel)[] = ["parcelNumber", "paidAmount", "nParcels", "productType", "weight"];
    for (const k of keys) {
      if (!parcel[k]) return false;
    }
    return true;
  }

  function clearShipper() {
    setShipper({ name: "", cin: "", phone: "", phoneCode: country === "Morocco" ? "+212" : "+33", cityId: undefined, country: country, address: "" });
  }
  function clearRecipient() {
    setRecipient({ recipientName: "", recipientCin: "", homeDelivery: true, recipientCityId: undefined, recipientPhone: "", recipientPhoneCode: country === "Morocco" ? "+33" : "+212" });
  }
  function clearParcel() {
    setParcel({ parcelNumber: "", paid: false, paidAmount: 0, nParcels: 1, productType: "", weight: 0 });
  }
  function clearPics() {
    setPics([]);
    setPicIdx(null);
    setPreviews([]);
  }

  async function handleSavePics(orderId: number) {
    const formData = new FormData();
    formData.append("orderId", orderId.toString());

    pics.forEach((pic: File) => {
      formData.append("images", pic);
    });

    await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async function handleDeletePics(ids: number[]) {
    await Promise.all(ids.map((id) => api.delete("/files/" + id)));
  }

  useEffect(() => {
    setShipper((prev) => ({ ...prev, phoneCode: country === "Morocco" ? "+212" : "+33", country: country }));
    setRecipient((prev) => ({ ...prev, recipientPhoneCode: country === "Morocco" ? "+33" : "+212" }));
    if (shipper.id !== undefined) clearShipper();
  }, [country]);

  useEffect(() => {
    (async () => {
      const [resCountries, resCitiesMoroccom, resCitiesFrance] = await Promise.all([axios.get("https://country-api.drnyeinchan.com/v1/countries"), api.get("/cities/Morocco"), api.get("/cities/France")]);
      setCountries(resCountries.data);
      setCities({ Morocco: resCitiesMoroccom.data, France: resCitiesFrance.data });
    })();
  }, []);

  function deletePic(id: number) {
    setPics((prev) => prev.filter((_, idx) => idx !== id));
    setPreviews((prev) => prev.filter((_, idx) => idx !== id));
  }

  // function addPics(e: any) {
  //   const files = Array.from((e.target.files as File[]) || []);
  //   const allowedFiles = files.filter((file) => file.type.startsWith("image/") && file.size / 1024 / 1024 <= 5);
  //   setPics((prev) => [...prev, ...allowedFiles.filter((file) => file.size / 1024 / 1024 <= 5)]);

  //   const urls = allowedFiles.map((file) => URL.createObjectURL(file));
  //   setPreviews((prev) => [...prev, ...urls]);

  //   e.target.value = "";
  // }

  function base64ToFile(base64: string, filename: string, mime: string): File {
    const byteString = atob(base64);
    const byteNumbers = new Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mime });
  }

  async function takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.Base64,
    });

    const file = base64ToFile(image.base64String!, `camera_${Date.now()}.jpeg`, `image/jpeg`);

    setPics((prev) => [...prev, file]);

    setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
  }

  return (
    <>
      <div className="space-y-2">
        <div className="p-4 bg-white border-l-8 rounded-lg border-primary shadow-xl space-y-2">
          <div>
            <p>{t("add.shipper.shipper")}</p>
            <p className="text-sm text-gray-900">{t("add.shipper.description")}</p>
          </div>
          <div className="flex gap-1">
            <Button className="flex-1" onClick={() => setOpenClientsModal(true)}>
              {t("add.shipper.select_shipper")}
            </Button>
            {shipper.id && (
              <div onClick={clearShipper} className="bg-red-600 rounded flex justify-center items-center p-2 aspect-square aspect-square text-white">
                <Trash2 />
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.name")}</label>
            <Input disabled={shipper.id !== undefined} value={shipper.name} onChange={(e: any) => setShipper({ ...shipper, name: e.target.value })} className="disabled:text-gray-500 disabled:bg-gray-100" />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.cin")}</label>
            <Input disabled={shipper.id !== undefined} value={shipper.cin} onChange={(e: any) => setShipper({ ...shipper, cin: e.target.value.toUpperCase() })} className="disabled:text-gray-500 disabled:bg-gray-100" />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.address")}</label>
            <Input disabled={shipper.id !== undefined} value={shipper.address} onChange={(e: any) => setShipper({ ...shipper, address: e.target.value })} className="disabled:text-gray-500 disabled:bg-gray-100" />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.city")}</label>
            <select disabled={shipper.id !== undefined} value={shipper.cityId} onChange={(e: any) => setShipper({ ...shipper, cityId: e.target.value })} className="w-full h-10 bg-white p-2 border border-gray-300 rounded disabled:opacity-100 disabled:!text-gray-500 disabled:bg-gray-100">
              <option value={undefined}>{t("common.select_city")}</option>
              {cities[country]?.map((city: City) => (
                <option key={"shipper_city" + city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.phone")}</label>
            <div className="flex gap-2">
              <div data-disabled={shipper.id !== undefined} className="flex border border-gray-300 rounded group flex-1 w-[calc(100%-12*0.25rem)] data-[disabled=true]:text-gray-500 data-[disabled=true]:bg-gray-100">
                <select disabled={shipper.id !== undefined} onChange={(e: any) => setShipper({ ...shipper, phoneCode: e.target.value })} className="w-28 bg-white px-2 focus:outline-none disabled:bg-gray-100" value={shipper.phoneCode}>
                  {countries.map((country, idx: number) => {
                    return (
                      country.phone_code && (
                        <option className="rtl:-translate-x-1/1" value={country.phone_code} key={"shipper_country" + idx}>
                          {country.flag} {country.phone_code}
                        </option>
                      )
                    );
                  })}
                </select>
                <input disabled={shipper.id !== undefined} type="number" value={shipper.phone} onChange={(e: any) => setShipper({ ...shipper, phone: e.target.value })} className="w-full focus:outline-none px-2 group-focus:border-black" />
              </div>
              <div className="bg-green-600 aspect-square h-10 flex justify-center items-center rounded">
                <a href={`https://api.whatsapp.com/send?phone=${shipper?.phoneCode?.slice(1)}${shipper?.phone}`} target="_blank">
                  <svg fill="#ffffff" width="32px" height="32px" viewBox="-6.4 -6.4 44.80 44.80" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.00032">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>whatsapp</title>
                      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>{" "}
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-l-8 rounded-lg border-green-700 shadow-xl space-y-2">
          <div>
            <p>{t("add.recipient.recipient")}</p>
            <p className="text-sm text-gray-900">{t("add.recipient.description")}</p>
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.name")}</label>
            <Input value={recipient.recipientName} onChange={(e: any) => setRecipient({ ...recipient, recipientName: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.cin")}</label>
            <Input value={recipient.recipientCin} onChange={(e: any) => setRecipient({ ...recipient, recipientCin: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.home_delivery")}</label>
            <div className="flex justify-evenly my-4">
              <div className="space-x-2">
                <input type="radio" name="home_delivery" id="home_delivery_no" checked={!recipient.homeDelivery} onChange={() => setRecipient({ ...recipient, homeDelivery: false })} />
                <label htmlFor="home_delivery_no">{t("common.no")}</label>
              </div>
              <div className="space-x-2">
                <input type="radio" name="home_delivery" id="home_delivery_yes" checked={recipient.homeDelivery} onChange={() => setRecipient({ ...recipient, homeDelivery: true })} />
                <label htmlFor="home_delivery_yes">{t("common.yes")}</label>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.city")}</label>
            <select value={recipient.recipientCityId} onChange={(e: any) => setRecipient({ ...recipient, recipientCityId: e.target.value })} className="w-full h-10 bg-white p-2 border border-gray-300 rounded">
              <option value={undefined}>{t("common.select_city")}</option>
              {cities[country === "Morocco" ? "France" : "Morocco"]?.map((city: City) => (
                <option key={"city" + city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.phone")}</label>
            <div className="flex gap-2">
              <div className="flex border border-gray-300 rounded group flex-1 w-[calc(100%-12*0.25rem)]">
                <select onChange={(e: any) => setRecipient({ ...recipient, recipientPhoneCode: e.target.value })} className="w-28 bg-white px-2 focus:outline-none" value={recipient.recipientPhoneCode}>
                  {countries.map((country, idx: number) => {
                    return (
                      country.phone_code && (
                        <option value={country.phone_code} key={"country" + idx}>
                          {country.flag} {country.phone_code}
                        </option>
                      )
                    );
                  })}
                </select>
                <input type="number" value={recipient.recipientPhone} onChange={(e: any) => setRecipient({ ...recipient, recipientPhone: e.target.value })} className="w-full focus:outline-none px-2 group-focus:border-black" />
              </div>
              <div className="bg-green-600 aspect-square h-10 flex justify-center items-center rounded">
                <a href={`https://api.whatsapp.com/send?phone=${recipient?.recipientPhoneCode?.slice(1)}${recipient?.recipientPhone}`} target="_blank">
                  <svg fill="#ffffff" width="32px" height="32px" viewBox="-6.4 -6.4 44.80 44.80" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.00032">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>whatsapp</title>{" "}
                      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>{" "}
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-l-8 rounded-lg border-red-700 shadow-xl space-y-2">
          <div>
            <p>{t("add.parcel.parcel")}</p>
            <p className="text-sm text-gray-900">{t("add.parcel.description")}</p>
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.parcel_number")}</label>
            <Input value={parcel.parcelNumber} onChange={(e: any) => setParcel({ ...parcel, parcelNumber: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.parcel.paid")}</label>
            <div className="flex justify-evenly my-4">
              <div className="space-x-2">
                <input type="radio" value="no" name="paid" id="paid_no" checked={!parcel.paid} onChange={() => setParcel({ ...parcel, paid: false })} />
                <label htmlFor="paid_no">{t("common.no")}</label>
              </div>
              <div className="space-x-2">
                <input type="radio" value="yes" name="paid" id="paid_yes" checked={parcel.paid} onChange={() => setParcel({ ...parcel, paid: true })} />
                <label htmlFor="paid_yes">{t("common.yes")}</label>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.parcel.paid_amount")}</label>
            <Input type="number" min="0" value={parcel.paidAmount} onChange={(e: any) => setParcel({ ...parcel, paidAmount: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.parcel.number_parcels")}</label>
            <Input type="number" min="0" value={parcel.nParcels} onChange={(e: any) => setParcel({ ...parcel, nParcels: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.parcel.weight")}</label>
            <Input type="number" min="0" value={parcel.weight} onChange={(e: any) => setParcel({ ...parcel, weight: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.parcel.product_type")}</label>
            <Input type="texr" value={parcel.productType} onChange={(e: any) => setParcel({ ...parcel, productType: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-900">{t("add.parcel.pics")}</label>
            <p className="text-xs pb-1 text-orange-700">({t("add.parcel.pics_warning")})</p>
            <div className=" outline outline-gray-300 rounded aspect-video overflow-y-auto grid grid-cols-2 gap-2 overflow-x-hidden">
              {previews.map((preview: string, idx: number) => (
                <div className="relative aspect-video flex justify-center items-center bg-gray-300 rounded" key={"pic-" + idx}>
                  <img src={preview} alt={`pic-${idx}`} className="rounded max-h-full" />
                  <button className="absolute text-white top-0 right-0 p-2 bg-gray-600/30 rounded" onClick={() => deletePic(idx)}>
                    <X />
                  </button>
                  <button className="absolute text-white bg-gray-600/30 p-2 rounded top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2" onClick={() => setPicIdx(idx)}>
                    <Eye />
                  </button>
                </div>
              ))}
              <div onClick={takePicture} className={clsx("flex aspect-video flex-col justify-center items-center bg-gray-300 text-xs", previews.length > 0 ? "" : "col-span-2")}>
                Upload Pictures
              </div>
              {/* <label htmlFor="pics" className={clsx("flex aspect-video flex-col justify-center items-center bg-gray-300 text-xs", previews.length > 0 ? "" : "col-span-2")}>
                Upload Pictures
              </label> */}
              {/* <input className="hidden" type="file" id="pics" accept="image/*" multiple onChange={addPics} /> */}
            </div>
          </div>
        </div>
        <Button className="w-full" onClick={handleSaveOrder}>
          {t("common.save")}
        </Button>
      </div>
      {picIdx !== null && (
        <div className="absolute inset-0 bg-black/70">
          <div className="relative w-full h-full flex justify-center items-center">
            <button className="absolute top-0 right-0 text-white p-4" onClick={() => setPicIdx(null)}>
              <X />
            </button>
            <img src={previews[picIdx]} key="showPic" alt="picture" className="rounded max-w-full max-h-[85dvh]" />
          </div>
        </div>
      )}
      <ClientsModal open={openClientsModal} setOpen={setOpenClientsModal} setShipper={setShipper} country={country} />
    </>
  );
}

type props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setShipper: (shipper: Shipper) => void;
  country: "Morocco" | "France";
};

function ClientsModal({ open, setOpen, setShipper, country }: props) {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchClients(country);
  }, [country]);

  useEffect(() => {
    setOpenDelete(open);
  }, [open]);

  useEffect(() => {
    setFiltered(clients.filter((client: Client) => client.name.toLowerCase().includes(search.toLowerCase())));
  }, [search]);

  async function fetchClients(country: string) {
    const res = await api.get("/clients/country/" + country);
    setClients(res.data);
    setFiltered(res.data);
  }

  function closeModal() {
    setOpenDelete(false);
    setTimeout(() => {
      setOpen(false);
      setSearch("");
    }, 300);
  }

  return (
    <>
      {open && (
        <div className={clsx("absolute inset-0 flex justify-center items-center duration-300", openDelete ? "bg-black/60" : "bg-black/0")}>
          <div className={clsx("py-4 space-y-4 w-5/6 max-h-[calc(100%/6*4)] bg-white rounded-xl shadow-xl duration-300", openDelete ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
            <div className="flex justify-between">
              <div className="px-4">{t("add.shipper.select_shipper")}</div>
              <button className="px-4" onClick={closeModal}>
                <X />
              </button>
            </div>
            <div className="px-4">
              <Input value={search} onChange={(e: any) => setSearch(e.target.value)} placeholder={t("common.search")} />
            </div>
            <div className="space-y-2 px-4 overflow-x-hidden overflow-y-auto">
              {filtered.map((client: Client) => (
                <div
                  key={"client-" + client.id}
                  onClick={() => {
                    setShipper({ ...client, country });
                    closeModal();
                  }}
                  className="p-4 w-full border rounded-lg shadow-lg"
                >
                  <p className="text-sm text-gray-900">
                    {t("add.name")}: {client.name}
                  </p>
                  <p className="text-sm text-gray-900">
                    {t("add.cin")}: {client.cin}
                  </p>
                  <p className="text-sm text-gray-900">
                    {t("add.phone")}: {client.phoneCode} {client.phone}
                  </p>
                  <p className="text-sm text-gray-900">
                    {t("add.address")}: {client.address}
                  </p>
                  <p className="text-sm text-gray-900">
                    {t("add.city")}: {client.city.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
