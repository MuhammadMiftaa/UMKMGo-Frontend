import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext";
import { UsersManagementProvider } from "../src/contexts/UserContext";
import { ProgramsProvider } from "../src/contexts/ProgramContext";
import { ApplicationsProvider } from "../src/contexts/ApplicationContext";
import App from "./App.tsx";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UsersManagementProvider>
          <ProgramsProvider>
            <ApplicationsProvider>
              <App />
            </ApplicationsProvider>
          </ProgramsProvider>
        </UsersManagementProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
