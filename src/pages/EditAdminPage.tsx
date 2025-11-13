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
    getUserById,
    currentUser,
    updateUser,
    isLoading,
  } = useUsersManagement();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role_id: 2,
  });

  // Load role permissions
  useEffect(() => {
    getListRolePermissions();
  }, []);

  // Load user data when ID changes
  useEffect(() => {
    if (id) {
      getUserById(Number(id));
    }
  }, [id]);

  // Populate form when user data is loaded
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        password: "",
        confirm_password: "",
        role_id: 2, // Default, you might want to get this from currentUser if available
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password && formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!id) {
      setError("User ID not found");
      return;
    }

    const result = await updateUser(Number(id), formData);

    if (result.success) {
      alert("User berhasil diupdate!");
      navigate("/admin/list");
    } else {
      setError(result.message || "Failed to update user");
    }
  };

  // Show loading state
  if (isLoading && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error if user not found
  if (!isLoading && !currentUser && id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">User Not Found</h2>
          <p className="text-muted-foreground">
            The user you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/list")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin List
          </Button>
        </div>
      </div>
    );
  }

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

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Leave password fields empty if you don't want to change the password
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Admin"}
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