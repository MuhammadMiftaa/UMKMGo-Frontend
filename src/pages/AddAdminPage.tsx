"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreateUserData, useUsersManagement } from "../contexts/UserContext";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../lib/toast";

export function AddAdminPage() {
  const navigate = useNavigate();

  const { rolePermissions, getListRolePermissions, createUser, isLoading } =
    useUsersManagement();

  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role_id: 2, // Default: admin_screening
  });

  useEffect(() => {
    getListRolePermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      showWarningToast("Nama lengkap tidak boleh kosong");
      return;
    }

    if (!formData.email.trim()) {
      showWarningToast("Email tidak boleh kosong");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      showWarningToast("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (formData.password.length < 8) {
      showWarningToast("Password minimal 8 karakter");
      return;
    }

    setSubmitLoading(true);
    try {
      const result = await createUser(formData);

      if (result.success) {
        showSuccessToast("Admin berhasil ditambahkan!");
        navigate("/admin/list");
      } else {
        showErrorToast(result.message || "Gagal menambahkan admin");
        setError(result.message || "Failed to create user");
      }
    } catch (error) {
      showErrorToast("Terjadi kesalahan saat menambahkan admin");
      setError("An unexpected error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tambah Admin Baru
          </h1>
          <p className="text-muted-foreground">
            Buat akun admin baru untuk sistem UMKMGo
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Informasi Admin Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                  disabled={submitLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@umkm.go.id"
                  disabled={submitLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({ ...formData, role_id: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                disabled={submitLoading}
              >
                {rolePermissions.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name
                      .replace("_", " ")
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Minimal 8 karakter"
                  disabled={submitLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                  placeholder="Ulangi password"
                  disabled={submitLoading}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={submitLoading || isLoading}
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  "Tambah Admin"
                )}
              </Button>
              <Button
                asChild
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                disabled={submitLoading}
              >
                <Link to="/settings">Batal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
