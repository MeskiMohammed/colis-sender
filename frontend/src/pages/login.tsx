import { useState } from "react";
import { t } from "i18next";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState<boolean>(false);
	const {setUser, setToken} = useAuth();
	const navigate = useNavigate();


  async function handleLogin() {
		setLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_PUBLIC_API_URL +"/login", form);
			setUser(res.data.user);
			setToken(res.data.token);
			navigate('/dashboard');
    } catch (err) {
      alert(JSON.stringify(err));
    }finally{
			setLoading(false);
		}
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden relative">
      <div className="h-[30%] sm:h-[20%] bg-primary rounded-b-[7rem] flex justify-center items-center">
        <img src="/logo-white.png" className="h-5/6" alt="logo" />
      </div>
      <div className="flex-1 flex flex-col py-10 items-center text-primary">
        <div className="w-10/12 space-y-8">
          <h1 className="text-3xl text-center">{t("login.login")}</h1>
          <br />
          <div>
            <label htmlFor="email">{t("login.email")}</label>
            <Input
              type="email"
              value={form.email}
							disabled={loading}
              onChange={(val) => setForm({ ...form, email: val })}
            />
          </div>
          <div>
            <label htmlFor="password">{t("login.password")}</label>
            <Input
              type="password"
              value={form.password}
							disabled={loading}
              onChange={(val) => setForm({ ...form, password: val })}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleLogin} disabled={loading} >{t("login.login")}</Button>
          </div>
        </div>
      </div>
      <div className="h-[10%] w-full bg-primary rounded-t-[7rem]"></div>
    </div>
  );
}
