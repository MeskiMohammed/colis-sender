import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@/lib/i18n";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

createRoot(document.getElementById("root")).render(
  <Wrapper>
    <App />
  </Wrapper>
);

function Wrapper({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute("dir", i18n.language === "ar" ? "rtl" : "ltr");
  }, [i18n.language]);

  return <>{children}</>;
}
