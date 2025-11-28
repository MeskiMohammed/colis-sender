import { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.email || !form.password) {
      if (!form.email) {
        setError({ ...error, email: true });
        toast.error(t("login.email_empty"), { id: "email" });
      }
      if (!form.password) {
        setError({ ...error, password: true });
        toast.error(t("login.password_empty"), { id: "password" });
      }
      return;
    }
    try {
      const res = await toast.promise(
        axios.post(import.meta.env.VITE_PUBLIC_API_URL + "/login", form),
        {
          loading: t("login.logging_in"),
          success: t("login.logged_in"),
          error: t("login.login_error"),
        },
        { id: "login" }
      );
      setUser(res.data.user);
      setToken(res.data.token);
      setError({ email: false, password: false });
      navigate("/list");
    } catch (err: any) {
      setError(err.response.data);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="h-1/3 bg-primary flex justify-center items-center">
        <img src="/logo-white.png" className="h-5/6" alt="logo" />
      </div>
      <div className="flex-1 flex flex-col justify-center  items-center text-primary">
        <div className="w-10/12 space-y-4">
          <h1 className="text-3xl text-center">{t("login.login")}</h1>
          <br />
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={error.email ? "text-red-600" : ""}>
                {t("login.email")}
              </label>
              <Input
                type="email"
                className={error.email ? "border-2 border-red-600 text-red-600" : ""}
                value={form.email}
                onChange={(e: any) => {
                  setForm({ ...form, email: e.target.value });
                  setError({ ...error, email: false });
                }}
              />
              <p className="text-red-600 text-sm h-4">{error?.email ? t("login.email_error") : ""}</p>
            </div>
            <div>
              <label htmlFor="password" className={error.password ? "text-red-600" : ""}>
                {t("login.password")}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className={error.password ? "border-2 border-red-600 text-red-600" : ""}
                  value={form.password}
                  onChange={(e: any) => {
                    setForm({ ...form, password: e.target.value });
                    setError({ ...error, password: false });
                  }}
                />
                {showPassword ? <Eye onClick={() => setShowPassword(false)} className="z-10 absolute top-1/2 -translate-y-1/2 right-2" /> : <EyeClosed onClick={() => setShowPassword(true)} className="absolute top-1/2 -translate-y-1/2 right-2" />}
              </div>
              <p className="text-red-600 text-sm h-4">{error?.password ? t("login.password_error") : ""}</p>
            </div>
            <div className="flex justify-end">
              <Button>{t("login.login")}</Button>
            </div>
          </form>
        </div>
      </div>
      {/* <div className="h-[10%] w-full bg-primary rounded-t-[7rem]"></div> */}
    </div>
  );
}
