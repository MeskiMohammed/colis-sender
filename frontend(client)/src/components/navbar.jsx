import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { i18n, t } = useTranslation();

  return (
    <nav dir="ltr" className="p-4 bg-gradient-to-b from-blue-400 via-blue-100 via-70% to-blue-100 flex justify-between">
      <img src="casmoh-logo.png" alt="logo" className="max-w-36 sm:max-w-48" />
      <select className="bg-transparent focus:outline-0" value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
        <option value="ar">🇲🇦 {t("arabic")}</option>
        <option value="fr">🇫🇷 {t("french")}</option>
      </select>
    </nav>
  );
}
