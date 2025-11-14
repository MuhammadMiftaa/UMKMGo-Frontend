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
import { Settings, Users, FileText, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast,
  showConfirmAlert 
} from "../lib/toast";

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
  const [applicationsFileType, setApplicationsFileType] = useState<"pdf" | "excel">("pdf");
  
  const [programsType, setProgramsType] = useState<
    "all" | "training" | "certification" | "funding"
  >("all");
  const [programsFileType, setProgramsFileType] = useState<"pdf" | "excel">("pdf");

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [slaLoading, setSlaLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

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
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showWarningToast("Nama dan email tidak boleh kosong");
      return;
    }

    showConfirmAlert({
      title: 'Konfirmasi Update Profil',
      message: "Apakah Anda yakin ingin memperbarui profil Anda?",
      confirmText: "Ya, Update",
      cancelText: "Batal",
      type: 'question',
      onConfirm: async () => {
        setProfileLoading(true);
        try {
          const result = await updateProfile(profileForm);

          if (result.success) {
            showSuccessToast("Profil berhasil diperbarui!");
          } else {
            showErrorToast(result.message || "Gagal memperbarui profil");
          }
        } catch (error) {
          showErrorToast("Terjadi kesalahan saat memperbarui profil");
        } finally {
          setProfileLoading(false);
        }
      },
    });
  };

  // Handle screening SLA update
  const handleUpdateScreeningSLA = async () => {
    if (screeningSLADays <= 0) {
      showWarningToast("Jumlah hari harus lebih dari 0");
      return;
    }

    showConfirmAlert({
      title: 'Konfirmasi Update SLA',
      message: `Apakah Anda yakin ingin mengubah SLA Screening menjadi ${screeningSLADays} hari?`,
      confirmText: "Ya, Update",
      cancelText: "Batal",
      type: 'question',
      onConfirm: async () => {
        setSlaLoading(true);
        try {
          const result = await updateScreeningSLA({
            max_days: screeningSLADays,
            description: "Screening SLA",
          });

          if (result.success) {
            showSuccessToast("SLA Screening berhasil diperbarui!");
          } else {
            showErrorToast(result.message || "Gagal memperbarui SLA Screening");
          }
        } catch (error) {
          showErrorToast("Terjadi kesalahan saat memperbarui SLA Screening");
        } finally {
          setSlaLoading(false);
        }
      },
    });
  };

  // Handle final SLA update
  const handleUpdateFinalSLA = async () => {
    if (finalSLADays <= 0) {
      showWarningToast("Jumlah hari harus lebih dari 0");
      return;
    }

    showConfirmAlert({
      title: 'Konfirmasi Update SLA',
      message: `Apakah Anda yakin ingin mengubah SLA Final menjadi ${finalSLADays} hari?`,
      confirmText: "Ya, Update",
      cancelText: "Batal",
      type: 'question',
      onConfirm: async () => {
        setSlaLoading(true);
        try {
          const result = await updateFinalSLA({
            max_days: finalSLADays,
            description: "Final SLA",
          });

          if (result.success) {
            showSuccessToast("SLA Final berhasil diperbarui!");
          } else {
            showErrorToast(result.message || "Gagal memperbarui SLA Final");
          }
        } catch (error) {
          showErrorToast("Terjadi kesalahan saat memperbarui SLA Final");
        } finally {
          setSlaLoading(false);
        }
      },
    });
  };

  // Handle export applications
  const handleExportApplications = async () => {
    setExportLoading(true);
    try {
      const result = await exportApplications({
        file_type: applicationsFileType,
        application_type: applicationsType,
      });

      if (result.success && result.data) {
        // Determine file extension
        const fileExt = applicationsFileType === "pdf" ? "pdf" : "xlsx";
        
        // Create download link
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `applications-${applicationsType}-${new Date().toISOString()}.${fileExt}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showSuccessToast(`Laporan pengajuan berhasil diunduh (${applicationsFileType.toUpperCase()})!`);
      } else {
        showErrorToast(result.message || "Gagal mengekspor laporan pengajuan");
      }
    } catch (error) {
      showErrorToast("Terjadi kesalahan saat mengekspor laporan");
    } finally {
      setExportLoading(false);
    }
  };

  // Handle export programs
  const handleExportPrograms = async () => {
    setExportLoading(true);
    try {
      const result = await exportPrograms({
        file_type: programsFileType,
        application_type: programsType,
      });

      if (result.success && result.data) {
        // Determine file extension
        const fileExt = programsFileType === "pdf" ? "pdf" : "xlsx";
        
        // Create download link
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `programs-${programsType}-${new Date().toISOString()}.${fileExt}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showSuccessToast(`Laporan program berhasil diunduh (${programsFileType.toUpperCase()})!`);
      } else {
        showErrorToast(result.message || "Gagal mengekspor laporan program");
      }
    } catch (error) {
      showErrorToast("Terjadi kesalahan saat mengekspor laporan");
    } finally {
      setExportLoading(false);
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
                disabled={profileLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                disabled={profileLoading}
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
              disabled={profileLoading || isLoading}
            >
              {profileLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Memperbarui...
                </>
              ) : (
                "Update Profil"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* SLA Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Konfigurasi SLA
            </CardTitle>
            <CardDescription>
              Atur batas waktu maksimal pengambilan keputusan
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
                  disabled={slaLoading}
                />
              </div>
              <Button
                className="mt-7"
                onClick={handleUpdateScreeningSLA}
                disabled={slaLoading || isLoading}
              >
                {slaLoading ? "..." : "Simpan"}
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
                  disabled={slaLoading}
                />
              </div>
              <Button
                className="mt-7"
                onClick={handleUpdateFinalSLA}
                disabled={slaLoading || isLoading}
              >
                {slaLoading ? "..." : "Simpan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Export Reports - Applications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cetak Laporan Pengajuan
            </CardTitle>
            <CardDescription>
              Ekspor data pengajuan dalam format PDF atau Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe Pengajuan</label>
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
                  disabled={exportLoading}
                >
                  <option value="all">Semua Tipe</option>
                  <option value="funding">Pendanaan</option>
                  <option value="training">Pelatihan</option>
                  <option value="certification">Sertifikasi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format File</label>
                <select
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={applicationsFileType}
                  onChange={(e) =>
                    setApplicationsFileType(e.target.value as "pdf" | "excel")
                  }
                  disabled={exportLoading}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Action</label>
                <Button
                  className="w-full"
                  onClick={handleExportApplications}
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Mengekspor...
                    </>
                  ) : (
                    <>
                      {applicationsFileType === "pdf" ? (
                        <FileText className="h-4 w-4 mr-2" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                      )}
                      Cetak Laporan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Reports - Programs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cetak Laporan Program
            </CardTitle>
            <CardDescription>
              Ekspor data program dalam format PDF atau Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe Program</label>
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
                  disabled={exportLoading}
                >
                  <option value="all">Semua Tipe</option>
                  <option value="funding">Pendanaan</option>
                  <option value="training">Pelatihan</option>
                  <option value="certification">Sertifikasi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format File</label>
                <select
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={programsFileType}
                  onChange={(e) =>
                    setProgramsFileType(e.target.value as "pdf" | "excel")
                  }
                  disabled={exportLoading}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Action</label>
                <Button
                  className="w-full"
                  onClick={handleExportPrograms}
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Mengekspor...
                    </>
                  ) : (
                    <>
                      {programsFileType === "pdf" ? (
                        <FileText className="h-4 w-4 mr-2" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                      )}
                      Cetak Laporan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}