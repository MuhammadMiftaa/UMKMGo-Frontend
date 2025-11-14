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
import { Checkbox } from "../components/ui/checkbox";
import { ArrowLeft, Shield, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { UpdateRolePermissionsData, useUsersManagement } from "../contexts/UserContext";
import { showSuccessToast, showErrorToast, showWarningToast, showConfirmAlert } from "../lib/toast";

export function AdminPermissionsPage() {
  const {
    getListPermissions,
    permissions,
    getListRolePermissions,
    rolePermissions,
    updateRolePermissions,
    isLoading,
  } = useUsersManagement();

  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    getListPermissions();
    getListRolePermissions();
  }, []);

  const handleRoleChange = (role_id: number) => {
    setSelectedRole(role_id);
    const permissions = rolePermissions.find(
      (role) => role.role_id === role_id
    )?.permissions;
    setSelectedPermissions(permissions || []);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  const handleSave = () => {
    if (!selectedRole) {
      showWarningToast("Silakan pilih role terlebih dahulu");
      return;
    }

    showConfirmAlert({
      title: 'Konfirmasi Perubahan',
      message: "Apakah Anda yakin ingin menyimpan perubahan hak akses untuk role ini?",
      confirmText: "Ya, Simpan",
      cancelText: "Batal",
      type: 'question',
      onConfirm: async () => {
        setSaveLoading(true);
        try {
          const data: UpdateRolePermissionsData = {
            role_id: selectedRole,
            permissions: selectedPermissions,
          };

          const result = await updateRolePermissions(data);

          if (result.success) {
            showSuccessToast("Hak akses berhasil diperbarui!");
            await getListRolePermissions(); // Refresh data
          } else {
            showErrorToast(result.message || "Gagal memperbarui hak akses");
          }
        } catch (error) {
          showErrorToast("Terjadi kesalahan saat memperbarui hak akses");
        } finally {
          setSaveLoading(false);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atur Hak Akses</h1>
          <p className="text-muted-foreground">
            Kelola hak akses untuk setiap role administrator
          </p>
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
            {rolePermissions.map((role) => (
              <div
                key={role.role_id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  role.role_id === selectedRole
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => {
                  handleRoleChange(role.role_id);
                }}
              >
                <div className="font-medium">
                  {role.role_name
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {role.permissions.length} permissions
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Hak Akses untuk{" "}
              {selectedRole
                ? rolePermissions
                    .find((role) => role.role_id === selectedRole)
                    ?.role_name.split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Role"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedRole ? (
              <div className="text-center py-8 text-muted-foreground">
                Pilih role untuk melihat dan mengelola hak akses
              </div>
            ) : (
              <>
                {permissions.map((permission) => (
                  <div
                    key={permission.code}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <Checkbox
                      id={permission.code}
                      checked={selectedPermissions.includes(permission.code)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission.code, checked as boolean)
                      }
                      disabled={saveLoading}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={permission.code}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {permission.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {permission.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        selectedPermissions.includes(permission.code)
                          ? "success"
                          : "secondary"
                      }
                    >
                      {selectedPermissions.includes(permission.code)
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </Badge>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleSave} 
                    className="w-full"
                    disabled={saveLoading || !selectedRole}
                  >
                    {saveLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Hak Akses
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}