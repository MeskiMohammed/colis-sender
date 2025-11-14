import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./providers/LanguageProvider.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>
);
