import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "./sidebar";


export default function Navbar() {
  const { i18n, t } = useTranslation();

  return (
    <nav className="w-full h-16 bg-primary flex justify-between items-center rounded-b-xl px-8 text-white">
      <SidebarTrigger />
      <img src="/logo-white.png" alt="logo" className="h-full" />
      <select className="bg-transparent focus:outline-0" value={i18n.language} onChange={(e:any) => i18n.changeLanguage(e.target.value)}>
        <option value="ar">🇲🇦{t('common.arabic')}</option>
        <option value="fr">🇫🇷{t('common.french')}</option>
      </select>
    </nav>
  );
}
