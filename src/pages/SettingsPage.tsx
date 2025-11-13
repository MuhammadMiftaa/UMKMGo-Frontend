"use client";

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
import { Settings, Users, FileText, Database, Target } from "lucide-react";
import { Link } from "react-router-dom";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola konfigurasi sistem dan pengaturan admin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management - Superadmin only */}
        {/* {user?.role === "superadmin" && ( */}
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
        {/* )} */}

        {/* Scoring Configuration - Superadmin only */}
        {/* {user?.role === "superadmin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Konfigurasi Penilaian
              </CardTitle>
              <CardDescription>Atur bobot dan kriteria penilaian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bobot Kategori Afirmatif (%)</label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bobot Wilayah 3T (%)</label>
                <Input type="number" defaultValue="25" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bobot Kepemilikan NIB (%)</label>
                <Input type="number" defaultValue="20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bobot Omzet / Skala Usaha (%)</label>
                <Input type="number" defaultValue="25" />
              </div>
              <Button className="w-full">Simpan Konfigurasi</Button>
            </CardContent>
          </Card>
        )} */}

        {/* {user?.role === "superadmin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Konfigurasi Cutoff Scoring
              </CardTitle>
              <CardDescription>Atur batas skor untuk status pengajuan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Batas Lolos (≥)</label>
                <Input type="number" defaultValue="75" />
                <p className="text-xs text-muted-foreground">Skor minimum untuk status "Lolos"</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Batas Hold (≥)</label>
                <Input type="number" defaultValue="55" />
                <p className="text-xs text-muted-foreground">Skor minimum untuk status "Hold" (55-74)</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Batas Gagal (&lt;)</label>
                <Input type="number" defaultValue="55" disabled />
                <p className="text-xs text-muted-foreground">Skor di bawah 55 akan berstatus "Gagal"</p>
              </div>
              <Button className="w-full">Simpan Cutoff</Button>
            </CardContent>
          </Card>
        )} */}

        {/* Document Templates */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template Dokumen
            </CardTitle>
            <CardDescription>Kelola template surat dan dokumen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full bg-transparent">
              Template Undangan Pelatihan
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Template Voucher Sertifikasi
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Template Kontrak Pendanaan
            </Button>
            {user?.role === "superadmin" && <Button className="w-full">Edit Template</Button>}
          </CardContent>
        </Card> */}

        {/* SLA Configuration - Superadmin only */}
        {/* {user?.role === "superadmin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Konfigurasi SLA
              </CardTitle>
              <CardDescription>Atur batas waktu proses per tahap</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Screening (hari)</label>
                <Input type="number" defaultValue="3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Penilaian (hari)</label>
                <Input type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Keputusan (hari)</label>
                <Input type="number" defaultValue="2" />
              </div>
              <Button className="w-full">Simpan SLA</Button>
            </CardContent>
          </Card>
        )} */}

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Kelola informasi akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama</label>
              <Input defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={user?.email} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input
                value={user?.role_name?.replace("_", " ").toUpperCase()}
                disabled
              />
            </div>
            <Button className="w-full mt-auto">Update Profil</Button>
          </CardContent>
        </Card>

        {/* Decision Making Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Pengaturan Waktu Keputusan
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
                  defaultValue="7"
                  placeholder="Jumlah hari"
                />
              </div>
              <Button className="mt-7">Simpan</Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Final (hari)</label>
                <Input
                  type="number"
                  defaultValue="14"
                  placeholder="Jumlah hari"
                />
              </div>
              <Button className="mt-7">Simpan</Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Laporan Pengajuan</label>
                <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                  <option value="all">Semua Tipe</option>
                  <option value="funding">Pendanaan</option>
                  <option value="training">Pelatihan</option>
                  <option value="certification">Sertifikasi</option>
                </select>
              </div>
              <Button className="mt-7">Cetak Laporan</Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Laporan Program</label>
                <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                  <option value="all">Semua Tipe</option>
                  <option value="funding">Pendanaan</option>
                  <option value="training">Pelatihan</option>
                  <option value="certification">Sertifikasi</option>
                </select>
              </div>
              <Button className="mt-7">Cetak Laporan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
