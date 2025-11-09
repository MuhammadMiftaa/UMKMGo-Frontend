"use client"

import { useParams, Navigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { mockApplications } from "../data/mockData"
import { useAuth } from "../contexts/AuthContext"
import { ArrowLeft, FileText, User, Calendar, MapPin, CheckCircle, XCircle, Award } from "lucide-react"
import { useState } from "react"

const statusLabels = {
  masuk: "Masuk",
  screening: "Screening",
  penilaian: "Penilaian",
  keputusan: "Keputusan",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  revisi: "Revisi",
  dibatalkan: "Dibatalkan",
}

export function ApplicationDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [rejectionReason, setRejectionReason] = useState("")
  const [revisionReason, setRevisionReason] = useState("")
  const [showRejectionInput, setShowRejectionInput] = useState(false)
  const [showRevisionInput, setShowRevisionInput] = useState(false)

  const application = mockApplications.find((app) => app.id === id)

  if (!application) {
    return <Navigate to="/" replace />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const canTakeAction = (status: string) => {
    if (user?.role === "superadmin") return true
    if (user?.role === "admin_kementrian") {
      return ["masuk", "screening", "penilaian"].includes(status)
    }
    return false
  }

  const calculateCriteriaScore = (criteria: any) => {
    const weights = {
      kategoriAfirmatif: 30,
      wilayah3T: 25,
      kepemilikanNIB: 20,
      omzetSkalaUsaha: 25,
    }

    let totalScore = 0
    if (criteria?.kategoriAfirmatif) totalScore += weights.kategoriAfirmatif
    if (criteria?.wilayah3T) totalScore += weights.wilayah3T
    if (criteria?.kepemilikanNIB) totalScore += weights.kepemilikanNIB
    if (criteria?.omzetSkalaUsaha) totalScore += weights.omzetSkalaUsaha

    return totalScore
  }

  const getCutoffStatus = (score: number) => {
    if (score >= 75) return { status: "Lolos", color: "text-green-600" }
    if (score >= 55) return { status: "Hold", color: "text-yellow-600" }
    return { status: "Gagal", color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Pengajuan</h1>
            <p className="text-muted-foreground">ID: {application.id}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
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
                  <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                  <p className="text-sm">{application.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NIK</label>
                  <p className="text-sm font-mono">{application.applicantNik}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Usaha</label>
                  <p className="text-sm">{application.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wilayah</label>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {application.region}
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
                  <label className="text-sm font-medium text-muted-foreground">Jenis Program</label>
                  <p className="text-sm capitalize">{application.type}</p>
                </div>
                {application.trainingType && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Jenis Pelatihan</label>
                    <p className="text-sm">{application.trainingType}</p>
                  </div>
                )}
                {application.certificationScheme && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Skema Sertifikasi</label>
                    <p className="text-sm">{application.certificationScheme}</p>
                  </div>
                )}
                {application.amount && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nominal Pengajuan</label>
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(application.amount)}</p>
                  </div>
                )}
                {application.fundingPurpose && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Tujuan Pendanaan</label>
                    <p className="text-sm">{application.fundingPurpose}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {application.scoringCriteria && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Kriteria Penilaian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {application.scoringCriteria.kategoriAfirmatif ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium">Kategori Afirmatif</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {application.scoringCriteria.kategoriAfirmatif ? "+30" : "0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {application.scoringCriteria.wilayah3T ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium">Wilayah 3T</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {application.scoringCriteria.wilayah3T ? "+25" : "0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {application.scoringCriteria.kepemilikanNIB ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium">Kepemilikan NIB</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {application.scoringCriteria.kepemilikanNIB ? "+20" : "0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {application.scoringCriteria.omzetSkalaUsaha ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium">Omzet / Skala Usaha</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {application.scoringCriteria.omzetSkalaUsaha ? "+25" : "0"}
                    </span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Total Skor:</span>
                      <span className="text-lg font-bold text-primary">
                        {calculateCriteriaScore(application.scoringCriteria)}/100
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pengajuan Disubmit</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(application.submittedAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Status Terakhir: {statusLabels[application.status]}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(application.updatedAt).toLocaleString("id-ID")}
                    </p>
                    {application.assignedTo && (
                      <p className="text-xs text-muted-foreground">Ditangani oleh: {application.assignedTo}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {application.notes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.notes.map((note, index) => (
                    <p key={index} className="text-sm p-3 bg-muted rounded-lg">
                      {note}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & SLA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status Saat Ini</label>
                <div className="mt-1">
                  <Badge
                    variant={
                      application.status === "disetujui"
                        ? "success"
                        : application.status === "ditolak"
                          ? "destructive"
                          : application.status === "revisi"
                            ? "warning"
                            : "default"
                    }
                  >
                    {statusLabels[application.status]}
                  </Badge>
                </div>
              </div>

              {/* Added cutoff status display */}
              {application.scoringCriteria && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status Cutoff</label>
                  <div className="mt-1">
                    <span
                      className={`text-sm font-semibold ${getCutoffStatus(calculateCriteriaScore(application.scoringCriteria)).color}`}
                    >
                      {getCutoffStatus(calculateCriteriaScore(application.scoringCriteria)).status}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Batas Waktu SLA</label>
                <p className="text-sm flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(application.slaDeadline).toLocaleString("id-ID")}
                </p>
              </div>

              {application.score && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Skor Penilaian</label>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${application.score}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{application.score}/100</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Added scoring recommendation text below Status & SLA card */}
          {application.scoringCriteria && (
            <Card>
              <CardContent className="pt-6">
                <p className={`text-sm ${getCutoffStatus(calculateCriteriaScore(application.scoringCriteria)).color}`}>
                  Berdasarkan pengaturan cutoff dengan skor {calculateCriteriaScore(application.scoringCriteria)},
                  pengajuan direkomendasikan untuk{" "}
                  {getCutoffStatus(calculateCriteriaScore(application.scoringCriteria)).status.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {user?.permissions.includes() && (
            <Card>
              <CardHeader>
                <CardTitle>Tindakan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {application.status === "screening" && (
                  <>
                    <Button className="w-full" variant="default">
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
                        <Button className="w-full" size="sm">
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
                        <Button className="w-full" variant="destructive" size="sm">
                          Konfirmasi Penolakan
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {application.status === "penilaian" && (
                  <>
                    <Button className="w-full" variant="default">
                      Rekomendasikan Setuju
                    </Button>
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => setShowRevisionInput(!showRevisionInput)}
                    >
                      Rekomendasikan Hold
                    </Button>
                    {showRevisionInput && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Masukkan catatan untuk hold..."
                          value={revisionReason}
                          onChange={(e) => setRevisionReason(e.target.value)}
                        />
                        <Button className="w-full" size="sm">
                          Kirim Rekomendasi Hold
                        </Button>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => setShowRejectionInput(!showRejectionInput)}
                    >
                      Rekomendasikan Tolak
                    </Button>
                    {showRejectionInput && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Masukkan alasan penolakan..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <Button className="w-full" variant="destructive" size="sm">
                          Konfirmasi Rekomendasi Tolak
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {application.status === "keputusan" && user?.role === "superadmin" && (
                  <>
                    <Button className="w-full" variant="default">
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
                        <Button className="w-full" variant="destructive" size="sm">
                          Konfirmasi Tolak Final
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
