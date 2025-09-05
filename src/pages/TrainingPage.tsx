"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { mockApplications } from "../data/mockData"
import { Search, Eye } from "lucide-react"

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

export function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const trainingApplications = mockApplications.filter((app) => app.type === "pelatihan")

  const filteredApplications = trainingApplications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getSLAStatus = (deadline: string) => {
    const now = new Date()
    const slaDate = new Date(deadline)
    const hoursLeft = (slaDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursLeft < 0) return "overdue"
    if (hoursLeft < 24) return "urgent"
    if (hoursLeft < 72) return "warning"
    return "normal"
  }

  const getSLABadge = (deadline: string) => {
    const status = getSLAStatus(deadline)
    const hoursLeft = Math.max(0, (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60))

    switch (status) {
      case "overdue":
        return <Badge variant="destructive">Terlambat</Badge>
      case "urgent":
        return <Badge variant="destructive">{Math.floor(hoursLeft)}h tersisa</Badge>
      case "warning":
        return <Badge variant="warning">{Math.floor(hoursLeft)}h tersisa</Badge>
      default:
        return <Badge variant="outline">{Math.floor(hoursLeft / 24)}d tersisa</Badge>
    }
  }

  const getCutoffStatus = (score: number) => {
    if (score >= 75) return { status: "Lolos", variant: "success" as const }
    if (score >= 55) return { status: "Hold", variant: "warning" as const }
    return { status: "Gagal", variant: "destructive" as const }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pelatihan UMKM</h1>
        <p className="text-muted-foreground">Kelola pengajuan pelatihan untuk UMKM</p>
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
              <option value="masuk">Masuk</option>
              <option value="screening">Screening</option>
              <option value="penilaian">Penilaian</option>
              <option value="keputusan">Keputusan</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
              <option value="revisi">Revisi</option>
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
                    <h3 className="font-semibold">{application.applicantName}</h3>
                    <Badge variant="outline">{application.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{application.businessName}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>Jenis:</strong> {application.trainingType}
                    </span>
                    <span>
                      <strong>Wilayah:</strong> {application.region}
                    </span>
                    {application.score && (
                      <span>
                        <strong>Skor:</strong> {application.score} ({getCutoffStatus(application.score).status})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Diajukan:</span>
                    <span className="text-sm">{new Date(application.submittedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2">
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
                    {getSLABadge(application.slaDeadline)}
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/application/${application.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {application.notes.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Catatan:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {application.notes.map((note, index) => (
                      <li key={index}>• {note}</li>
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
            <p className="text-muted-foreground">Tidak ada pengajuan pelatihan yang ditemukan.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
