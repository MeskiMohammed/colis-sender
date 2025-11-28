import { createRoot } from "react-dom/client";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "@/lib/i18n";
import { CountryProvider } from "./providers/CountryProvider.tsx";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

createRoot(document.getElementById("root")!).render(
  <Wrapper>
    <Router>
      <AuthProvider>
        <CountryProvider>
          <App />
          <Toaster />
        </CountryProvider>
      </AuthProvider>
    </Router>
  </Wrapper>
);

function Wrapper({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute("dir", i18n.language === "ar" ? "rtl" : "ltr");
  }, [i18n.language]);

  return (
    <div className="safe-area-y w-screen h-screen bg-black overflow-hidden">
      <div className="relative w-full h-full overflow-hidden bg-blue-50">{children}</div>
    </div>
  );
}
