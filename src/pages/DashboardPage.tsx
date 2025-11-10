import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockApplications } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { Link } from "react-router-dom";
import { useApplications } from "../contexts/ApplicationContext";
import { useEffect } from "react";
import { Programs, Status } from "../lib/const";

const statusColors = {
  masuk: "bg-blue-500",
  screening: "bg-yellow-500",
  penilaian: "bg-orange-500",
  keputusan: "bg-purple-500",
  disetujui: "bg-green-500",
  ditolak: "bg-red-500",
  revisi: "bg-gray-500",
  dibatalkan: "bg-gray-400",
};

const statusLabels = {
  masuk: "Masuk",
  screening: "Screening",
  penilaian: "Penilaian",
  keputusan: "Keputusan",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  revisi: "Revisi",
  dibatalkan: "Dibatalkan",
};

const cardTypeData = [
  { name: "Kartu Produktif", count: 245 },
  { name: "Kartu Afirmatif", count: 189 },
  { name: "Tidak memiliki keduanya", count: 156 },
];

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--color-sky-500)",
  },
} satisfies ChartConfig;

export function DashboardPage() {
  const { applications, getAllApplications } = useApplications();

  useEffect(() => {
    getAllApplications();
  }, []);
  // Calculate statistics
  const totalApplications = mockApplications.length;
  const pendingApplications = mockApplications.filter((app) =>
    ["masuk", "screening", "penilaian", "keputusan"].includes(app.status)
  ).length;
  const approvedApplications = mockApplications.filter(
    (app) => app.status === "disetujui"
  ).length;
  const rejectedApplications = mockApplications.filter(
    (app) => app.status === "ditolak"
  ).length;

  // Status distribution data
  const statusData = Object.entries(
    mockApplications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([status, count]) => ({
    name: statusLabels[status as keyof typeof statusLabels],
    value: count,
    color: statusColors[status as keyof typeof statusColors],
  }));

  // Type distribution data
  const typeData = Object.entries(
    mockApplications.reduce(
      (acc, app) => {
        acc[app.type] = (acc[app.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }));

  const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan pengajuan dan statistik UMKM
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengajuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Semua pengajuan yang masuk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Menunggu tindakan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedApplications}
            </div>
            <p className="text-xs text-muted-foreground">Pengajuan berhasil</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedApplications}
            </div>
            <p className="text-xs text-muted-foreground">Pengajuan ditolak</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
            <CardDescription>Sebaran status pengajuan saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jenis Pengajuan</CardTitle>
            <CardDescription>
              Distribusi berdasarkan jenis program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Added horizontal bar chart for card type distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Jenis Kartu</CardTitle>
          <CardDescription>
            Perbandingan jumlah pengguna berdasarkan jenis kartu yang dimiliki
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              barGap={0.05}
              barCategoryGap={0.05}
              data={cardTypeData}
              layout="vertical"
              margin={{
                left: -20,
              }}
            >
              <XAxis type="number" dataKey="count" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={1}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 100)}
                width={200}
                fontSize={14}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-sky-500)"
                radius={20}
                barSize={200}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Terbaru</CardTitle>
          <CardDescription>5 pengajuan terakhir yang masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 flex flex-col">
            {applications.slice(0, 5).map(
              (application) =>
                application.status === Status.SCREENING && (
                  <Link
                    key={application.id}
                    to={`/application/${application.id}`}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {application.program?.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.umkm?.business_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {application.type === Programs.CERTIFICATION ? "CERT-" : application.type === Programs.TRAINING ? "TRAN-" : "FUND-"}{application.id}
                        </p>
                      </div>
                      <div className="text-right space-y-1 capitalize">
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
                          {application.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground capitalize">
                          {application.type}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
