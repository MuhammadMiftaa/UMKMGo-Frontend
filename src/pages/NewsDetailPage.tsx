"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { ArrowLeft, Edit, Trash2, Calendar, User } from "lucide-react";
import { useNews } from "../contexts/NewsContext";
import { NewsCategoriesMap } from "../lib/const";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmAlert,
} from "../lib/toast";

export function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getNewsById,
    currentNews: news,
    deleteNews,
    publishNews,
    unpublishNews,
    isLoading,
  } = useNews();

  const [isPublished, setIsPublished] = useState(news?.is_published || false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getNewsById(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (news) {
      setIsPublished(news.is_published);
    }
  }, [news]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Memuat detail berita...</p>
        </div>
      </div>
    );
  }

  if (!news && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Berita Tidak Ditemukan</h1>
          <Button variant="outline" size="sm" onClick={() => navigate("/news")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Berita yang Anda cari tidak ada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    showConfirmAlert({
      message: `Apakah Anda yakin ingin menghapus berita "${news?.title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const result = await deleteNews(Number(id));

          if (result.success) {
            showSuccessToast("Berita berhasil dihapus");
            setTimeout(() => {
              navigate("/news");
            }, 1500);
          } else {
            showErrorToast(result.message || "Gagal menghapus berita");
          }
        } catch (error) {
          showErrorToast("Terjadi kesalahan saat menghapus berita");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleTogglePublish = (checked: boolean) => {
    const action = checked ? "mempublikasikan" : "membatalkan publikasi";

    showConfirmAlert({
      message: `Apakah Anda yakin ingin ${action} berita ini?`,
      confirmText: `Ya, ${checked ? "Publikasikan" : "Batalkan"}`,
      cancelText: "Batal",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const result = checked
            ? await publishNews(Number(id))
            : await unpublishNews(Number(id));

          if (result.success) {
            setIsPublished(checked);
            showSuccessToast(
              `Berita berhasil ${checked ? "dipublikasikan" : "dibatalkan publikasinya"}`
            );
          } else {
            showErrorToast(result.message || `Gagal ${action} berita`);
          }
        } catch (error) {
          showErrorToast(`Terjadi kesalahan saat ${action} berita`);
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  if (!news) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{news.title}</h1>
          <p className="text-muted-foreground">Detail Berita</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/news")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/news/${news.id}/edit`)}
            disabled={actionLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Memproses...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Thumbnail */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={news.thumbnail || "/placeholder.svg"}
              alt={news.title}
              className="w-full h-96 object-cover rounded-t-lg"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Dipublikasikan" : "Draft"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {NewsCategoriesMap[news.category]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">{news.excerpt}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Konten</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </CardContent>
          </Card>

          {news.tags && news.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      #{tag}
                    </Badge>
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
              <CardTitle>Status Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="publish-toggle">Publikasikan</Label>
                <Switch
                  id="publish-toggle"
                  checked={isPublished}
                  onCheckedChange={handleTogglePublish}
                  disabled={actionLoading}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {isPublished
                  ? "Berita ini sudah dipublikasikan dan dapat dilihat oleh publik."
                  : "Berita ini masih dalam status draft dan belum dipublikasikan."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Dibuat</p>
                  <p className="text-muted-foreground">
                    {new Date(news.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Terakhir Diupdate</p>
                  <p className="text-muted-foreground">
                    {new Date(news.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {news.created_by_name && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Pembuat</p>
                    <p className="text-muted-foreground">
                      {news.created_by_name}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}