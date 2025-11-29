import { Routes, Route } from "react-router-dom";
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
import { EditAdminPage } from "./pages/EditAdminPage";
import { NewsListPage } from "./pages/NewsListPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { NewsFormPage } from "./pages/NewsFormPage";

function App() {
  return (
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
        <Route path="admin/edit/:id" element={<EditAdminPage />} />
        <Route path="admin/list" element={<AdminListPage />} />
        <Route path="admin/permissions" element={<AdminPermissionsPage />} />

        <Route path="programs/training" element={<ProgramTrainingsPage />} />
        <Route
          path="programs/certification"
          element={<ProgramCertificationsPage />}
        />
        <Route path="programs/funding" element={<ProgramFundingsPage />} />

        <Route
          path="programs/training/create"
          element={<CreateProgramPage />}
        />
        <Route
          path="programs/certification/create"
          element={<CreateProgramPage />}
        />
        <Route path="programs/funding/create" element={<CreateProgramPage />} />

        <Route path="programs/training/:id" element={<ProgramDetailPage />} />
        <Route
          path="programs/certification/:id"
          element={<ProgramDetailPage />}
        />
        <Route path="programs/funding/:id" element={<ProgramDetailPage />} />

        <Route
          path="programs/training/:id/edit"
          element={<CreateProgramPage />}
        />
        <Route
          path="programs/certification/:id/edit"
          element={<CreateProgramPage />}
        />
        <Route
          path="programs/funding/:id/edit"
          element={<CreateProgramPage />}
        />
        <Route path="news" element={<NewsListPage />} />
        <Route path="news/:id" element={<NewsDetailPage />} />
        <Route path="news/create" element={<NewsFormPage />} />
        <Route path="news/:id/edit" element={<NewsFormPage />} />
      </Route>
    </Routes>
  );
}

export default App;
