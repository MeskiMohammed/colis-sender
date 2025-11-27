import axios from "axios";
import { Frown, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

export default function Check() {
  const [internet, setInternet] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        await axios.get(import.meta.env.VITE_PUBLIC_API_URL);
        setInternet(true);
      } catch (err) {
        setInternet(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Loading />;
  } else if (!internet && !loading) {
    return <NoInternet />;
  } else if (internet && !loading) {
    return <Navigate to="/login" />;
  }
}

function NoInternet() {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex justify-center items-center flex-col bg-gray-700 text-white">
      <Frown size={200} />
      <p className="text-4xl font-semibold text-center">{t("common.no_internet")}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="absolute inset-0 flex justify-around bg-background items-center flex-col">
      <img src="/logo-white.png" alt="logo" className="w-2/3 bg-primary p-8 rounded-xl" />
      <Loader size={50} className="animate-spin" />
    </div>
  );
}
