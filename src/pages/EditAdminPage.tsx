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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUsersManagement } from "../contexts/UserContext";

export function EditAdminPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    rolePermissions,
    getListRolePermissions,
    users,
    getAllUsers,
    isLoading,
  } = useUsersManagement();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role_id: 2,
  });

  useEffect(() => {
    getListRolePermissions();
    getAllUsers();
  }, []);

  useEffect(() => {
    if (id && users.length > 0) {
      const user = users.find((u) => u.id === Number(id));
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role_id: 1,
        });
      }
    }
  }, [id, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO: Implement update user API call
    // For now, just show success message
    alert("User berhasil diupdate!");
    navigate("/admin/list");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Admin</h1>
          <p className="text-muted-foreground">Ubah informasi akun admin</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/list">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Informasi Admin
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

            {error && <div className="text-sm text-red-500">{error}</div>}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Admin
              </Button>
              <Button
                asChild
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Link to="/admin/list">Batal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
