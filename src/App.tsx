import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TrainingPage } from "./pages/TrainingPage";
import { CertificationPage } from "./pages/CertificationPage";
import { FundingPage } from "./pages/FundingPage";
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AddAdminPage } from "./pages/AddAdminPage";
import { AdminListPage } from "./pages/AdminListPage";
import { AdminPermissionsPage } from "./pages/AdminPermissionsPage";
import ProgramTrainingsPage from "./pages/programs/TrainingListPage";
import ProgramCertificationsPage from "./pages/programs/CertificationListPage";
import ProgramFundingsPage from "./pages/programs/FundingListPage";
import CreateProgramPage from "./pages/programs/CreateProgramPage";
import ProgramDetailPage from "./pages/programs/ProgramDetailPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

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

          <Route path="programs/trainings" element={<ProgramTrainingsPage />} />
          <Route
            path="programs/certifications"
            element={<ProgramCertificationsPage />}
          />
          <Route path="programs/fundings" element={<ProgramFundingsPage />} />

          <Route
            path="programs/trainings/create"
            element={<CreateProgramPage />}
          />
          <Route
            path="programs/certifications/create"
            element={<CreateProgramPage />}
          />
          <Route
            path="programs/fundings/create"
            element={<CreateProgramPage />}
          />

          <Route
            path="programs/trainings/:id"
            element={<ProgramDetailPage />}
          />
          <Route
            path="programs/certifications/:id"
            element={<ProgramDetailPage />}
          />
          <Route path="programs/fundings/:id" element={<ProgramDetailPage />} />

          <Route
            path="programs/trainings/:id/edit"
            element={<CreateProgramPage />}
          />
          <Route
            path="programs/certifications/:id/edit"
            element={<CreateProgramPage />}
          />
          <Route
            path="programs/fundings/:id/edit"
            element={<CreateProgramPage />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
