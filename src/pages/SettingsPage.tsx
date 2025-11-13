"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { Settings, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function SettingsPage() {
  const { user } = useAuth();
  const {
    screeningSLA,
    finalSLA,
    getScreeningSLA,
    getFinalSLA,
    updateScreeningSLA,
    updateFinalSLA,
    updateProfile,
    exportApplications,
    exportPrograms,
    isLoading,
  } = useSettings();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // SLA form state
  const [screeningSLADays, setScreeningSLADays] = useState<number>(7);
  const [finalSLADays, setFinalSLADays] = useState<number>(14);

  // Export form state
  const [applicationsType, setApplicationsType] = useState<
    "all" | "training" | "certification" | "funding"
  >("all");
  const [programsType, setProgramsType] = useState<
    "all" | "training" | "certification" | "funding"
  >("all");

  // Load SLA data on mount
  useEffect(() => {
    getScreeningSLA();
    getFinalSLA();
  }, []);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Update SLA days when loaded
  useEffect(() => {
    if (screeningSLA) {
      setScreeningSLADays(screeningSLA.max_days);
    }
  }, [screeningSLA]);

  useEffect(() => {
    if (finalSLA) {
      setFinalSLADays(finalSLA.max_days);
    }
  }, [finalSLA]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    const result = await updateProfile(profileForm);

    if (result.success) {
      alert("Profile updated successfully!");
    } else {
      alert(result.message || "Failed to update profile");
    }
  };

  // Handle screening SLA update
  const handleUpdateScreeningSLA = async () => {
    const result = await updateScreeningSLA({
      max_days: screeningSLADays,
      description: "Screening SLA",
    });

    if (result.success) {
      alert("Screening SLA updated successfully!");
    } else {
      alert(result.message || "Failed to update screening SLA");
    }
  };

  // Handle final SLA update
  const handleUpdateFinalSLA = async () => {
    const result = await updateFinalSLA({
      max_days: finalSLADays,
      description: "Final SLA",
    });

    if (result.success) {
      alert("Final SLA updated successfully!");
    } else {
      alert(result.message || "Failed to update final SLA");
    }
  };

  // Handle export applications
  const handleExportApplications = async () => {
    const result = await exportApplications({
      file_type: "pdf",
      application_type: applicationsType,
    });

    if (result.success && result.data) {
      // Create download link
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applications-${applicationsType}-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("Applications exported successfully!");
    } else {
      alert(result.message || "Failed to export applications");
    }
  };

  // Handle export programs
  const handleExportPrograms = async () => {
    const result = await exportPrograms({
      file_type: "pdf",
      application_type: programsType,
    });

    if (result.success && result.data) {
      // Create download link
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `programs-${programsType}-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("Programs exported successfully!");
    } else {
      alert(result.message || "Failed to export programs");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola konfigurasi sistem dan pengaturan admin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manajemen Pengguna
            </CardTitle>
            <CardDescription>Kelola akun admin dan hak akses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/admin/add">Tambah Admin Baru</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link to="/admin/list">Lihat Daftar Admin</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link to="/admin/permissions">Atur Hak Akses</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Kelola informasi akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama</label>
              <Input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input
                value={user?.role_name?.replace("_", " ").toUpperCase()}
                disabled
              />
            </div>
            <Button
              className="w-full mt-auto"
              onClick={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profil"}
            </Button>
          </CardContent>
        </Card>

        {/* SLA Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Konfigurasi SLA & Cetak Laporan
            </CardTitle>
            <CardDescription>
              Atur batas waktu maksimal pengambilan keputusan dan cetak laporan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Screening (hari)</label>
                <Input
                  type="number"
                  value={screeningSLADays}
                  onChange={(e) =>
                    setScreeningSLADays(Number.parseInt(e.target.value))
                  }
                  placeholder="Jumlah hari"
                />
              </div>
              <Button
                className="mt-7"
                onClick={handleUpdateScreeningSLA}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Simpan"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Final (hari)</label>
                <Input
                  type="number"
                  value={finalSLADays}
                  onChange={(e) =>
                    setFinalSLADays(Number.parseInt(e.target.value))
                  }
                  placeholder="Jumlah hari"
                />
              </div>
              <Button
                className="mt-7"
                onClick={handleUpdateFinalSLA}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Simpan"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Laporan Pengajuan</label>
                <select
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={applicationsType}
                  onChange={(e) =>
                    setApplicationsType(
                      e.target.value as
                        | "all"
                        | "training"
                        | "certification"
                        | "funding"
                    )
                  }
                >
                  <option value="all">Semua Tipe</option>
                  <option value="funding">Pendanaan</option>
                  <option value="training">Pelatihan</option>
                  <option value="certification">Sertifikasi</option>
                </select>
              </div>
              <Button
                className="mt-7"
                onClick={handleExportApplications}
                disabled={isLoading}
              >
                {isLoading ? "Exporting..." : "Cetak Laporan"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Laporan Program</label>
                <select
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={programsType}
                  onChange={(e) =>
                    setProgramsType(
                      e.target.value as
                        | "all"
                        | "training"
                        | "certification"
                        | "funding"
                    )
                  }
                >
                  <option value="all">Semua Tipe</option>
                  <option value="funding">Pendanaan</option>
                  <option value="training">Pelatihan</option>
                  <option value="certification">Sertifikasi</option>
                </select>
              </div>
              <Button
                className="mt-7"
                onClick={handleExportPrograms}
                disabled={isLoading}
              >
                {isLoading ? "Exporting..." : "Cetak Laporan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
