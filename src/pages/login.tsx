import { useLanguage } from "../providers/LanguageProvider";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="bg-blue-600">
      {t("login.login")}
      <br />
      <button onClick={() => changeLanguage(language === "fr" ? "ar" : "fr")}>
        hello {language}
      </button>
    </div>
  );
}
