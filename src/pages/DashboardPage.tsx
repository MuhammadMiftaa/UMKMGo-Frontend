import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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
import { useDashboard } from "../contexts/DashboardContext";
import { Programs, Status } from "../lib/const";

const COLORS = [
  "#0284c7", // sky-600
  "#0ea5e9", // sky-500 (base)
  "#38bdf8", // sky-400
  "#7dd3fc", // sky-300
];

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--color-sky-500)",
  },
} satisfies ChartConfig;

export function DashboardPage() {
  const { applications, getAllApplications } = useApplications();
  const {
    cardTypeData,
    statusSummary,
    statusDetail,
    applicationByType,
    fetchAllDashboardData,
    isLoading,
  } = useDashboard();

  useEffect(() => {
    // Fetch all data on mount
    fetchAllDashboardData();
    getAllApplications();
  }, []);

  // Transform status detail for pie chart
  const statusData = statusDetail
    ? [
        { name: "Screening", value: statusDetail.screening },
        { name: "Revised", value: statusDetail.revised },
        { name: "Final", value: statusDetail.final },
        { name: "Approved", value: statusDetail.approved },
        { name: "Rejected", value: statusDetail.rejected },
      ].filter((item) => item.value > 0)
    : [];

  // Transform application by type for bar chart
  const typeData = applicationByType
    ? [
        { name: "Pelatihan", count: applicationByType.training },
        { name: "Sertifikasi", count: applicationByType.certification },
        { name: "Pendanaan", count: applicationByType.funding },
      ]
    : [];

  const getProgramTypeLabel = (type: string) => {
    switch (type) {
      case Programs.TRAINING:
        return "Pelatihan";
      case Programs.CERTIFICATION:
        return "Sertifikasi";
      case Programs.FUNDING:
        return "Pendanaan";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">
              {statusSummary?.total_applications || 0}
            </div>
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
            <div className="text-2xl font-bold">
              {statusSummary?.in_process || 0}
            </div>
            <p className="text-xs text-muted-foreground">Menunggu tindakan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusSummary?.approved || 0}
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
              {statusSummary?.rejected || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pengajuan ditolak</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
            <CardDescription>Sebaran status pengajuan saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
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
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-sky-500)">
                    {typeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Jenis Kartu</CardTitle>
            <CardDescription>
              Perbandingan jumlah pengguna berdasarkan jenis kartu yang dimiliki
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cardTypeData.length > 0 ? (
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
                    width={100}
                    fontSize={14}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--color-sky-500)"
                    radius={10}
                    barSize={100}
                  >
                    {cardTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Terbaru</CardTitle>
          <CardDescription>5 pengajuan terakhir yang masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 flex flex-col">
            {applications?.slice(0, 5).map(
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
                          ID:{" "}
                          {application.type === Programs.CERTIFICATION
                            ? "CERT-"
                            : application.type === Programs.TRAINING
                              ? "TRAN-"
                              : "FUND-"}
                          {application.id}
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
                          {getProgramTypeLabel(application.type)}
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
