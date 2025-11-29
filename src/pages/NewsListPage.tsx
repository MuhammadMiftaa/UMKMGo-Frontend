"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import { useNews } from "../contexts/NewsContext";
import { NewsCategoriesMap, Permissions } from "../lib/const";
import {
  showConfirmAlert,
  showSuccessToast,
  showErrorToast,
} from "../lib/toast";
import { CardListSkeleton } from "../components/skeleton/CardSkeleton";
import { useAuth } from "../contexts/AuthContext";

export function NewsListPage() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    getAllNews,
    newsList,
    deleteNews,
    publishNews,
    unpublishNews,
    isLoading,
  } = useNews();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    getAllNews();
  }, []);

  const filteredNews = newsList.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || news.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && news.is_published) ||
      (statusFilter === "draft" && !news.is_published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id: number, title: string) => {
    showConfirmAlert({
      message: `Apakah Anda yakin ingin menghapus berita "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      onConfirm: async () => {
        setActionLoading(id);
        try {
          const result = await deleteNews(id);

          if (result.success) {
            showSuccessToast("Berita berhasil dihapus");
          } else {
            showErrorToast(result.message || "Gagal menghapus berita");
          }
        } catch (error) {
          showErrorToast("Terjadi kesalahan saat menghapus berita");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleTogglePublish = async (
    id: number,
    isPublished: boolean,
    title: string
  ) => {
    const action = isPublished ? "membatalkan publikasi" : "mempublikasikan";

    showConfirmAlert({
      message: `Apakah Anda yakin ingin ${action} berita "${title}"?`,
      confirmText: `Ya, ${isPublished ? "Batalkan" : "Publikasikan"}`,
      cancelText: "Batal",
      onConfirm: async () => {
        setActionLoading(id);
        try {
          const result = isPublished
            ? await unpublishNews(id)
            : await publishNews(id);

          if (result.success) {
            showSuccessToast(
              `Berita berhasil ${isPublished ? "dibatalkan publikasinya" : "dipublikasikan"}`
            );
          } else {
            showErrorToast(result.message || `Gagal ${action} berita`);
          }
        } catch (error) {
          showErrorToast(`Terjadi kesalahan saat ${action} berita`);
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const stripHtml = (html: string, maxLength: number = 150) => {
    console.log("Stripping HTML content", html);
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Berita
          </h1>
          <p className="text-muted-foreground">
            Kelola berita, pengumuman, dan konten untuk UMKM
          </p>
        </div>
        {user?.permissions?.includes(Permissions.CREATE_NEWS) && (
          <Button onClick={() => navigate("/news/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Berita
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul atau isi berita..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="announcement">Pengumuman</SelectItem>
                <SelectItem value="success_story">Kisah Sukses</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="article">Artikel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="published">Dipublikasikan</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* News List */}
      {isLoading ? (
        <CardListSkeleton count={5} />
      ) : !user?.permissions?.includes(Permissions.VIEW_NEWS) ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-full bg-muted p-3">
                <ShieldAlert className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Akses Ditolak</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Anda tidak memiliki izin untuk melihat daftar artikel. Silakan
                  hubungi administrator untuk mendapatkan akses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={news.thumbnail || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant={news.is_published ? "default" : "secondary"}>
                    {news.is_published ? "Dipublikasikan" : "Draft"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {NewsCategoriesMap[news.category]}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {stripHtml(news.excerpt, 120)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {news.tags?.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {news.tags?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{news.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>
                    Dibuat:{" "}
                    {new Date(news.created_at).toLocaleDateString("id-ID")}
                  </p>
                  {news.created_by_name && <p>Oleh: {news.created_by_name}</p>}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/news/${news.id}`)}
                    disabled={actionLoading === news.id}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat
                  </Button>
                  {user?.permissions?.includes(Permissions.EDIT_NEWS) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/news/${news.id}/edit`)}
                        disabled={actionLoading === news.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleTogglePublish(
                            news.id,
                            news.is_published,
                            news.title
                          )
                        }
                        disabled={actionLoading === news.id}
                      >
                        {news.is_published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  )}
                  {user?.permissions?.includes(
                    Permissions.DELETE_NEWS
                  ) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(news.id, news.title)}
                      disabled={actionLoading === news.id}
                    >
                      {actionLoading === news.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading &&
        user?.permissions?.includes(Permissions.VIEW_NEWS) &&
        filteredNews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Tidak ada berita yang ditemukan.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
