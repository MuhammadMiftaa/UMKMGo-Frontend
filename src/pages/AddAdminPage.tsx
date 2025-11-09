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
import { get } from "http";

export function AddAdminPage() {
  const navigate = useNavigate();

  const { rolePermissions, getListRolePermissions, createUser, isLoading } =
    useUsersManagement();

  const [error, setError] = useState("");
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
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const result = await createUser(formData);

    if (result.success) {
      alert("User created successfully!");
      navigate("/admin/list");
    } else {
      setError(result.message || "Failed to create user");
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
            Buat akun admin baru untuk sistem SAPA UMKM
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
      </div>

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
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@umkm.go.id"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({ ...formData, role_id: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Minimal 8 karakter"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
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
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Tambah Admin
              </Button>
              <Button
                asChild
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
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
