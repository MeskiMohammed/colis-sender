import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./providers/LanguageProvider.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { CountryProvider } from "./providers/CountryProvider.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <Router>
        <AuthProvider>
          <CountryProvider>
            <App />
            <Toaster/>
          </CountryProvider>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  </StrictMode>
);
