import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext";
import { UsersManagementProvider } from "../src/contexts/UserContext";
import { ProgramsProvider } from "../src/contexts/ProgramContext";
import { ApplicationsProvider } from "../src/contexts/ApplicationContext";
import App from "./App.tsx";
import "./globals.css";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";
import { DashboardProvider } from "./contexts/DashboardContext.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UsersManagementProvider>
          <ProgramsProvider>
            <ApplicationsProvider>
              <SettingsProvider>
                <DashboardProvider>
                  <App />
                  <Toaster position="top-right" />
                </DashboardProvider>
              </SettingsProvider>
            </ApplicationsProvider>
          </ProgramsProvider>
        </UsersManagementProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
