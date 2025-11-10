"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ArrowLeft, Search, Edit, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useUsersManagement } from "../contexts/UserContext";

export function AdminListPage() {
  const { getAllUsers, users, deleteUser } = useUsersManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAdmins = users.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (admin.is_active ? "active" : "inactive") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDelete = async (adminId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus admin ini?")) {
      await deleteUser(adminId);
      getAllUsers(); // Refresh the list after deletion
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Admin</h1>
          <p className="text-muted-foreground">
            Kelola akun administrator sistem UMKMGo
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Admin List */}
      <div className="space-y-4">
        {filteredAdmins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{admin.name}</h3>
                    <Badge variant="outline">{admin.email}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>Role:</strong>{" "}
                      {admin.role_name
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                    <span>
                      <strong>Status:</strong>
                      <Badge
                        variant={admin.is_active ? "success" : "secondary"}
                        className="ml-1"
                      >
                        {admin.is_active ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Login terakhir:{" "}
                      {new Date(admin.last_login_at).toLocaleString("id-ID")}
                    </span>
                    <span>
                      Dibuat:{" "}
                      {new Date(admin.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAdmins.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Tidak ada admin yang ditemukan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
