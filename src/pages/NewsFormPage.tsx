"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { ArrowLeft, Upload, X } from "lucide-react";
import { CreateNewsData, NewsCategory, useNews } from "../contexts/NewsContext";
import { NewsCategories } from "../lib/const";
import { fileToBase64, isImageFile, validateImageSize } from "../lib/utils";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../lib/toast";

export function NewsFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const {
    createNews,
    getNewsById,
    currentNews,
    updateNews,
    clearCurrentNews,
    isLoading,
  } = useNews();

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<CreateNewsData>({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    category: NewsCategories.ANNOUNCEMENT as NewsCategory,
    is_published: false,
    tags: [],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");

  useEffect(() => {
    if (isEditMode && id) {
      getNewsById(Number(id));
    }

    return () => {
      if (isEditMode) {
        clearCurrentNews();
      }
    };
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentNews) {
      setFormData({
        title: currentNews.title || "",
        excerpt: currentNews.excerpt || "",
        content: currentNews.content || "",
        thumbnail: currentNews.thumbnail || "",
        category:
          currentNews.category || (NewsCategories.ANNOUNCEMENT as NewsCategory),
        is_published: currentNews.is_published ?? false,
        tags: currentNews.tags || [],
      });

      if (currentNews.thumbnail) {
        setThumbnailPreview(currentNews.thumbnail);
      }
    }
  }, [currentNews, isEditMode]);

  const handleInputChange = (field: keyof CreateNewsData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    try {
      if (!isImageFile(file)) {
        showWarningToast("Mohon upload file gambar (JPG, PNG, dll)");
        return;
      }

      if (!validateImageSize(file, 5)) {
        showWarningToast("Ukuran file maksimal 5MB");
        return;
      }

      setIsUploading(true);

      const base64String = await fileToBase64(file);

      handleInputChange("thumbnail", base64String);
      setThumbnailPreview(base64String);

      showSuccessToast("Gambar berhasil diupload!");
    } catch (error) {
      console.error("Error uploading file:", error);
      showErrorToast("Gagal mengupload gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const insertHtmlTag = (tag: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);

    let insertion = "";
    switch (tag) {
      case "h2":
        insertion = `<h2>${selectedText || "Heading 2"}</h2>`;
        break;
      case "h3":
        insertion = `<h3>${selectedText || "Heading 3"}</h3>`;
        break;
      case "p":
        insertion = `<p>${selectedText || "Paragraf"}</p>`;
        break;
      case "strong":
        insertion = `<strong>${selectedText || "Bold"}</strong>`;
        break;
      case "em":
        insertion = `<em>${selectedText || "Italic"}</em>`;
        break;
      case "ul":
        insertion = `<ul>\n  <li>${selectedText || "Item 1"}</li>\n  <li>Item 2</li>\n</ul>`;
        break;
      case "ol":
        insertion = `<ol>\n  <li>${selectedText || "Item 1"}</li>\n  <li>Item 2</li>\n</ol>`;
        break;
      case "blockquote":
        insertion = `<blockquote>${selectedText || "Quote"}</blockquote>`;
        break;
    }

    const newContent =
      formData.content.substring(0, start) +
      insertion +
      formData.content.substring(end);

    handleInputChange("content", newContent);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + insertion.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.excerpt || !formData.content) {
      showWarningToast("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (!formData.thumbnail) {
      showWarningToast("Mohon upload gambar thumbnail");
      return;
    }

    let result;
    setIsUploading(true);

    try {
      if (isEditMode && id) {
        result = await updateNews(Number(id), formData);
      } else {
        result = await createNews(formData);
      }

      if (result.success) {
        showSuccessToast(
          isEditMode ? "Berita berhasil diperbarui!" : "Berita berhasil dibuat!"
        );
        navigate("/news");
      } else {
        showErrorToast(
          result.message ||
            `Gagal ${isEditMode ? "memperbarui" : "membuat"} berita`
        );
        setError(
          result.message ||
            `Gagal ${isEditMode ? "memperbarui" : "membuat"} berita`
        );
      }
    } catch (error) {
      showErrorToast(
        `Terjadi kesalahan saat ${isEditMode ? "memperbarui" : "membuat"} berita`
      );
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsUploading(false);
    }
  };

  if (isEditMode && isLoading && !currentNews) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Memuat data berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit" : "Buat"} Berita
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Perbarui informasi berita"
              : "Tambahkan berita baru untuk UMKM"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/news")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <p className="font-medium">Kesalahan</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Berita *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul berita"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: NewsCategory) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger data-testid="category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NewsCategories.ANNOUNCEMENT}>
                      Pengumuman
                    </SelectItem>
                    <SelectItem value={NewsCategories.SUCCESS_STORY}>
                      Kisah Sukses
                    </SelectItem>
                    <SelectItem value={NewsCategories.EVENT}>Event</SelectItem>
                    <SelectItem value={NewsCategories.ARTICLE}>
                      Artikel
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Masukkan ringkasan berita (maks. 200 karakter)"
                rows={3}
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.excerpt.length}/200 karakter
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  handleInputChange("is_published", checked)
                }
              />
              <Label htmlFor="is_published">Publikasikan Sekarang</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {thumbnailPreview ? (
                <div className="space-y-2">
                  <img
                    src={thumbnailPreview}
                    alt="Pratinjau thumbnail"
                    className="w-full max-w-md h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setThumbnailPreview("");
                      handleInputChange("thumbnail", "");
                    }}
                    disabled={isUploading}
                  >
                    Hapus
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer"
                      >
                        <span className="text-sm text-muted-foreground">
                          {isUploading
                            ? "Mengupload..."
                            : "Klik untuk upload thumbnail (rasio 16:9)"}
                        </span>
                        <Input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                        />
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konten Berita *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("h2")}
              >
                H2
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("h3")}
              >
                H3
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("p")}
              >
                P
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("strong")}
              >
                <strong>B</strong>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("em")}
              >
                <em>I</em>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("ul")}
              >
                UL
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("ol")}
              >
                OL
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertHtmlTag("blockquote")}
              >
                Quote
              </Button>
            </div>

            <Textarea
              ref={contentRef}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Tulis konten berita dengan HTML..."
              rows={20}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Gunakan HTML tags untuk formatting. Contoh: &lt;h2&gt;, &lt;p&gt;,
              &lt;strong&gt;, &lt;ul&gt;, dll.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Masukkan tag dan tekan Enter"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Tambah
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/news")}
            disabled={isLoading || isUploading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading
              ? isEditMode
                ? "Memperbarui..."
                : "Membuat..."
              : isEditMode
                ? "Perbarui Berita"
                : "Buat Berita"}
          </Button>
        </div>
      </form>
    </div>
  );
}
