import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { TrainingPage } from "./pages/TrainingPage"
import { CertificationPage } from "./pages/CertificationPage"
import { FundingPage } from "./pages/FundingPage"
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage"
import { SettingsPage } from "./pages/SettingsPage"
import { AddAdminPage } from "./pages/AddAdminPage"
import { AdminListPage } from "./pages/AdminListPage"
import { AdminPermissionsPage } from "./pages/AdminPermissionsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="certification" element={<CertificationPage />} />
          <Route path="funding" element={<FundingPage />} />
          <Route path="application/:id" element={<ApplicationDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin/add" element={<AddAdminPage />} />
          <Route path="admin/list" element={<AdminListPage />} />
          <Route path="admin/permissions" element={<AdminPermissionsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
