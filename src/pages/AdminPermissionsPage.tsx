"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Checkbox } from "../components/ui/checkbox"
import { ArrowLeft, Shield, Save } from "lucide-react"
import { Link } from "react-router-dom"

const permissions = [
  { id: "view_dashboard", name: "Lihat Dashboard", description: "Akses ke halaman dashboard utama" },
  { id: "manage_training", name: "Kelola Pelatihan", description: "Mengelola pengajuan pelatihan UMKM" },
  { id: "manage_certification", name: "Kelola Sertifikasi", description: "Mengelola pengajuan sertifikasi UMKM" },
  { id: "manage_funding", name: "Kelola Pendanaan", description: "Mengelola pengajuan pendanaan UMKM" },
  { id: "approve_applications", name: "Setujui Pengajuan", description: "Memberikan persetujuan final pengajuan" },
  { id: "manage_users", name: "Kelola Pengguna", description: "Menambah, edit, dan hapus akun admin" },
  { id: "system_settings", name: "Pengaturan Sistem", description: "Mengubah konfigurasi sistem dan SLA" },
  { id: "view_reports", name: "Lihat Laporan", description: "Akses ke laporan dan analitik sistem" },
  { id: "manage_templates", name: "Kelola Template", description: "Edit template dokumen dan surat" },
]

const rolePermissions = {
  superadmin: [
    "view_dashboard",
    "manage_training",
    "manage_certification",
    "manage_funding",
    "approve_applications",
    "manage_users",
    "system_settings",
    "view_reports",
    "manage_templates",
  ],
  admin_kementrian: ["view_dashboard", "manage_training", "manage_certification", "manage_funding", "view_reports"],
}

export function AdminPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<string>("admin_kementrian")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    rolePermissions[selectedRole as keyof typeof rolePermissions] || [],
  )

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    setSelectedPermissions(rolePermissions[role as keyof typeof rolePermissions] || [])
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId))
    }
  }

  const handleSave = () => {
    console.log("Saving permissions for role:", selectedRole, selectedPermissions)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atur Hak Akses</h1>
          <p className="text-muted-foreground">Kelola hak akses untuk setiap role administrator</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Pilih Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRole === "admin_kementrian" ? "bg-primary/10 border-primary" : "hover:bg-muted"
              }`}
              onClick={() => handleRoleChange("admin_kementrian")}
            >
              <div className="font-medium">Admin Kementrian</div>
              <div className="text-sm text-muted-foreground">Akses operasional terbatas</div>
            </div>
            <div
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRole === "superadmin" ? "bg-primary/10 border-primary" : "hover:bg-muted"
              }`}
              onClick={() => handleRoleChange("superadmin")}
            >
              <div className="font-medium">Super Administrator</div>
              <div className="text-sm text-muted-foreground">Akses penuh ke semua fitur</div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Hak Akses untuk {selectedRole === "superadmin" ? "Super Administrator" : "Admin Kementrian"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                    {permission.name}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                </div>
                <Badge variant={selectedPermissions.includes(permission.id) ? "success" : "secondary"}>
                  {selectedPermissions.includes(permission.id) ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button onClick={handleSave} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Simpan Hak Akses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
