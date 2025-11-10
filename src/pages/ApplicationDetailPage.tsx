"use client";

import { useParams, Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  HistoryAction,
  HistoryActionMap,
  Permissions,
  Programs,
  ProgramsMap,
  Status,
  StatusMap,
} from "../lib/const";
import {
  ApplicationDecision,
  useApplications,
} from "../contexts/ApplicationContext";

export function ApplicationDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    getApplicationById,
    currentApplication: application,
    screeningApprove,
    screeningReject,
    screeningRevise,
    finalApprove,
    finalReject,
  } = useApplications();
  const [rejectionReason, setRejectionReason] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  useEffect(() => {
    if (id) {
      getApplicationById(Number(id));
    }
  }, [id]);

  if (!application) {
    return <Navigate to="/" replace />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleScreeningApprove = async () => {
    const result = await screeningApprove(application.id);

    if (result.success) {
      alert("Pengajuan berhasil disetujui!");
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  const handleScreeningReject = async () => {
    if (!rejectionReason) {
      alert("Alasan penolakan tidak boleh kosong.");
      return;
    }

    const payload: ApplicationDecision = {
      action: "reject",
      notes: rejectionReason,
      application_id: application.id,
    };

    const result = await screeningReject(payload);
    if (result.success) {
      alert("Pengajuan berhasil ditolak!");
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  const handleScreeningRevise = async () => {
    if (!revisionReason) {
      alert("Instruksi perbaikan tidak boleh kosong.");
      return;
    }

    const payload: ApplicationDecision = {
      action: "revise",
      notes: revisionReason,
      application_id: application.id,
    };

    const result = await screeningRevise(payload);
    if (result.success) {
      alert("Instruksi perbaikan berhasil dikirim!");
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  const handleFinalApprove = async () => {
    const result = await finalApprove(application.id);

    if (result.success) {
      alert("Pengajuan berhasil disetujui secara final!");
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  const handleFinalReject = async () => {
    if (!rejectionReason) {
      alert("Alasan penolakan tidak boleh kosong.");
      return;
    }

    const payload: ApplicationDecision = {
      action: "reject",
      notes: rejectionReason,
      application_id: application.id,
    };

    const result = await finalReject(payload);
    if (result.success) {
      alert("Pengajuan berhasil ditolak secara final!");
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Detail Pengajuan
            </h1>
            <p className="text-muted-foreground">ID: {application.id}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Pemohon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Lengkap
                  </label>
                  <p className="text-sm">{application.umkm?.user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nomor Telepon
                  </label>
                  <p className="text-sm">{application.umkm?.phone || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    NIK
                  </label>
                  <p className="text-sm font-mono">{application.umkm?.nik}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Usaha
                  </label>
                  <p className="text-sm">{application.umkm?.business_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Alamat
                  </label>
                  <p className="text-sm">{application.umkm?.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Wilayah
                  </label>
                  <p className="text-sm flex items-center gap-1 capitalize">
                    <MapPin className="h-4 w-4" />
                    {application.umkm?.city?.name?.toLocaleLowerCase()},{" "}
                    {application.umkm?.province?.name?.toLocaleLowerCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detail Pengajuan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Jenis Program
                  </label>
                  <p className="text-sm capitalize">
                    {ProgramsMap[application.type]}
                  </p>
                </div>
                {application.type === Programs.TRAINING && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Jenis Pelatihan
                    </label>
                    <p className="text-sm">
                      {application.program?.title ?? "-"}
                    </p>
                  </div>
                )}
                {application.type === Programs.CERTIFICATION && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Skema Sertifikasi
                    </label>
                    <p className="text-sm">{application.program?.title}</p>
                  </div>
                )}
                {application.amount && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nominal Pengajuan
                    </label>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(application.amount)}
                    </p>
                  </div>
                )}
                {application.fundingPurpose && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Tujuan Pendanaan
                    </label>
                    <p className="text-sm">{application.fundingPurpose}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(application?.histories?.length ?? 0) &&
                  (application.histories ?? []).map((history, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                    >
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {HistoryActionMap[history.status]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(history?.actioned_at).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {history.status === HistoryAction.SUBMIT
                            ? "Dibuat oleh"
                            : "Ditangani oleh"}
                          : {history.actioned_by_name}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {application?.histories?.[(application?.histories?.length ?? 0) - 1]
            .notes && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm p-3 bg-muted rounded-lg">
                    {
                      application?.histories?.[
                        (application?.histories?.length ?? 0) - 1
                      ].notes
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Batas Waktu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status Saat Ini
                </label>
                <div className="mt-1">
                  <Badge
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
                    {StatusMap[application.status]}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Batas Waktu Pesetujuan
                </label>
                <p className="text-sm flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(application.expired_at).toLocaleString("id-ID")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}

          <Card>
            <CardHeader>
              <CardTitle>Tindakan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {application.status === Status.SCREENING &&
                ((application.type === Programs.CERTIFICATION &&
                  user?.permissions?.includes(
                    Permissions.SCREENING_CERTIFICATION
                  )) ||
                  (application.type === Programs.TRAINING &&
                    user?.permissions?.includes(
                      Permissions.SCREENING_TRAINING
                    )) ||
                  (application.type === Programs.FUNDING &&
                    user?.permissions?.includes(
                      Permissions.SCREENING_FUNDING
                    ))) && (
                  <>
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={handleScreeningApprove}
                    >
                      Lolos Screening
                    </Button>
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => setShowRevisionInput(!showRevisionInput)}
                    >
                      Minta Perbaikan
                    </Button>
                    {showRevisionInput && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Masukkan instruksi perbaikan..."
                          value={revisionReason}
                          onChange={(e) => setRevisionReason(e.target.value)}
                        />
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={handleScreeningRevise}
                        >
                          Kirim Instruksi Perbaikan
                        </Button>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => setShowRejectionInput(!showRejectionInput)}
                    >
                      Tolak Administratif
                    </Button>
                    {showRejectionInput && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Masukkan alasan penolakan..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <Button
                          className="w-full"
                          variant="destructive"
                          size="sm"
                          onClick={handleScreeningReject}
                        >
                          Konfirmasi Penolakan
                        </Button>
                      </div>
                    )}
                  </>
                )}

              {application.status === Status.FINAL &&
                ((application.type === Programs.CERTIFICATION &&
                  user?.permissions?.includes(
                    Permissions.FINAL_CERTIFICATION
                  )) ||
                  (application.type === Programs.TRAINING &&
                    user?.permissions?.includes(Permissions.FINAL_TRAINING)) ||
                  (application.type === Programs.FUNDING &&
                    user?.permissions?.includes(
                      Permissions.FINAL_FUNDING
                    ))) && (
                  <>
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={handleFinalApprove}
                    >
                      Setujui Final
                    </Button>
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => setShowRejectionInput(!showRejectionInput)}
                    >
                      Tolak Final
                    </Button>
                    {showRejectionInput && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Masukkan alasan penolakan final..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <Button
                          className="w-full"
                          variant="destructive"
                          size="sm"
                          onClick={handleFinalReject}
                        >
                          Konfirmasi Tolak Final
                        </Button>
                      </div>
                    )}
                  </>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
