"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Eye } from "lucide-react";
import { useApplications } from "../contexts/ApplicationContext";
import { Programs, Status } from "../lib/const";

export function FundingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { getAllApplications, applications } = useApplications();

  useEffect(() => {
    getAllApplications();
  }, []);

  const fundingApplications = applications.filter(
    (app) => app.type === Programs.FUNDING
  );

  const filteredApplications = fundingApplications.filter((app) => {
    const matchesSearch =
      app.umkm?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.umkm?.business_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSLABadge = (deadline: string) => {
    const now = new Date();
    const slaDate = new Date(deadline);
    const hoursLeft = Math.max(
      0,
      (slaDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    if (hoursLeft < 0) return <Badge variant="destructive">Terlambat</Badge>;
    if (hoursLeft < 24)
      return (
        <Badge variant="destructive">{Math.floor(hoursLeft)}h tersisa</Badge>
      );
    if (hoursLeft < 72)
      return <Badge variant="warning">{Math.floor(hoursLeft)}h tersisa</Badge>;
    return (
      <Badge variant="outline">{Math.floor(hoursLeft / 24)}d tersisa</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pendanaan UMKM</h1>
        <p className="text-muted-foreground">
          Kelola pengajuan pendanaan untuk UMKM
        </p>
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
                  placeholder="Cari nama, usaha, atau ID..."
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
              <option value={Status.SCREENING}>Screening</option>
              <option value={Status.REVISED}>Revisi</option>
              <option value={Status.FINAL}>Final</option>
              <option value={Status.APPROVED}>Disetujui</option>
              <option value={Status.REJECTED}>Ditolak</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {application.umkm?.user?.name}
                    </h3>
                    <Badge variant="outline">FUND-{application.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {application.umkm?.business_name}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>Nama Program:</strong> {application.program?.title}
                    </span>
                    <span>
                      <strong>Penyedia:</strong> {application.program?.provider}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Diajukan:
                    </span>
                    <span className="text-sm">
                      {new Date(application.submitted_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className="capitalize"
                      variant={
                        application.status === Status.APPROVED
                          ? "success"
                          : application.status === Status.REJECTED
                            ? "destructive"
                            : application.status === Status.REVISED
                              ? "warning"
                              : application.status === Status.SCREENING
                                ? "secondary"
                                : "default"
                      }
                    >
                      {application.status}
                    </Badge>
                    {getSLABadge(application.expired_at)}
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/application/${application.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {(application?.histories?.length ?? 0) > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Catatan:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {application?.histories?.map((history, index) => (
                      <li key={index}>• {history.notes}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Tidak ada pengajuan pendanaan yang ditemukan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
