"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import {
  CreateProgramData,
  ProgramType,
  TrainingType,
  usePrograms,
} from "../../contexts/ProgramContext";
import { Programs, TrainingTypes } from "../../lib/const";
import { fileToBase64, isImageFile, validateImageSize } from "../../lib/utils";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../../lib/toast";

export default function CreateProgramPage() {
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    createProgram,
    getProgramById,
    currentProgram,
    updateProgram,
    clearCurrentProgram,
    isLoading,
  } = usePrograms();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programType =
    (searchParams.get("type") as ProgramType) || Programs.TRAINING;

  const [formData, setFormData] = useState<CreateProgramData>({
    title: "",
    description: "",
    banner: "",
    provider: "",
    provider_logo: "",
    type: programType,
    training_type: TrainingTypes.OFFLINE as TrainingType,
    batch: 0,
    batch_start_date: "",
    batch_end_date: "",
    location: "",
    min_amount: 0,
    max_amount: 0,
    interest_rate: 0,
    max_tenure_months: 0,
    application_deadline: "",
    is_active: true,
    benefits: [],
    requirements: [],
  });

  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isEditMode && id) {
      getProgramById(Number(id));
    }

    return () => {
      if (isEditMode) {
        clearCurrentProgram();
      }
    };
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentProgram) {
      setFormData({
        title: currentProgram.title || "",
        description: currentProgram.description || "",
        banner: currentProgram.banner || "",
        provider: currentProgram.provider || "",
        provider_logo: currentProgram.provider_logo || "",
        type: currentProgram.type || programType,
        training_type:
          currentProgram.training_type ||
          (TrainingTypes.OFFLINE as TrainingType),
        batch: currentProgram.batch || 0,
        batch_start_date: currentProgram.batch_start_date || "",
        batch_end_date: currentProgram.batch_end_date || "",
        location: currentProgram.location || "",
        min_amount: currentProgram.min_amount || 0,
        max_amount: currentProgram.max_amount || 0,
        interest_rate: currentProgram.interest_rate || 0,
        max_tenure_months: currentProgram.max_tenure_months || 0,
        application_deadline: currentProgram.application_deadline || "",
        is_active: currentProgram.is_active ?? true,
        benefits: currentProgram.benefits || [],
        requirements: currentProgram.requirements || [],
      });

      if (currentProgram.banner) {
        setBannerPreview(currentProgram.banner);
      }
      if (currentProgram.provider_logo) {
        setLogoPreview(currentProgram.provider_logo);
      }
    }
  }, [currentProgram, isEditMode, programType]);

  const handleInputChange = (field: keyof CreateProgramData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (
    field: "banner" | "provider_logo",
    file: File
  ) => {
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

      handleInputChange(field, base64String);

      if (field === "banner") {
        setBannerPreview(base64String);
      } else {
        setLogoPreview(base64String);
      }

      showSuccessToast("File berhasil diupload!");
    } catch (error) {
      console.error("Error uploading file:", error);
      showErrorToast("Gagal mengupload file. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...(prev.benefits ?? []), ""],
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: (prev.benefits ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: (prev.benefits ?? []).map((b, i) => (i === index ? value : b)),
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...(prev.requirements ?? []), ""],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: (prev.requirements ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: (prev.requirements ?? []).map((r, i) =>
        i === index ? value : r
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.application_deadline
    ) {
      showWarningToast("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (!formData.banner || !formData.provider_logo) {
      showWarningToast("Mohon upload banner dan logo provider");
      return;
    }

    let result;
    setIsUploading(true);

    try {
      if (isEditMode && id) {
        result = await updateProgram(Number(id), formData);
      } else {
        result = await createProgram(formData);
      }

      if (result.success) {
        showSuccessToast(
          isEditMode
            ? "Program berhasil diperbarui!"
            : "Program berhasil dibuat!"
        );
        navigate(`/programs/${formData.type}`);
      } else {
        showErrorToast(
          result.message ||
            `Gagal ${isEditMode ? "memperbarui" : "membuat"} program`
        );
        setError(
          result.message ||
            `Gagal ${isEditMode ? "memperbarui" : "membuat"} program`
        );
      }
    } catch (error) {
      showErrorToast(
        `Terjadi kesalahan saat ${isEditMode ? "memperbarui" : "membuat"} program`
      );
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsUploading(false);
    }
  };

  if (isEditMode && isLoading && !currentProgram) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Memuat data program...</p>
        </div>
      </div>
    );
  }

  if (isEditMode && !isLoading && !currentProgram && id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">
            Program Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground">
            Program yang ingin Anda edit tidak ada.
          </p>
          <Button onClick={() => navigate("/programs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Program
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center w-full justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {isEditMode ? "Edit" : "Buat"} Program{" "}
            {getProgramTypeLabel(formData.type)}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? `Perbarui detail program ${getProgramTypeLabel(formData.type).toLowerCase()}`
              : `Tambahkan program ${getProgramTypeLabel(formData.type).toLowerCase()} baru`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/programs/${formData.type}`)}
        >
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
                <Label htmlFor="title">Judul Program *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul program"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Penyedia *</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) =>
                    handleInputChange("provider", e.target.value)
                  }
                  placeholder="Masukkan nama penyedia"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Masukkan deskripsi program"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Jenis Program *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ProgramType) =>
                    handleInputChange("type", value)
                  }
                  disabled={isEditMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Programs.TRAINING}>Pelatihan</SelectItem>
                    <SelectItem value={Programs.CERTIFICATION}>
                      Sertifikasi
                    </SelectItem>
                    <SelectItem value={Programs.FUNDING}>Pendanaan</SelectItem>
                  </SelectContent>
                </Select>
                {isEditMode && (
                  <p className="text-xs text-muted-foreground">
                    Jenis program tidak dapat diubah saat mengedit
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Batas Waktu Pendaftaran *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) =>
                    handleInputChange("application_deadline", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  handleInputChange("is_active", checked)
                }
              />
              <Label htmlFor="is_active">Program Aktif</Label>
            </div>
          </CardContent>
        </Card>

        {(formData.type === Programs.TRAINING ||
          formData.type === Programs.CERTIFICATION) && (
          <Card>
            <CardHeader>
              <CardTitle>
                Detail{" "}
                {formData.type === Programs.TRAINING
                  ? "Pelatihan"
                  : "Sertifikasi"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="training_type">Tipe</Label>
                  <Select
                    value={formData.training_type}
                    onValueChange={(value: TrainingType) =>
                      handleInputChange("training_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TrainingTypes.ONLINE}>
                        Online
                      </SelectItem>
                      <SelectItem value={TrainingTypes.OFFLINE}>
                        Offline
                      </SelectItem>
                      <SelectItem value={TrainingTypes.HYBRID}>
                        Hybrid
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch">Nomor Batch</Label>
                  <Input
                    id="batch"
                    type="number"
                    value={formData.batch || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "batch",
                        Number.parseInt(e.target.value)
                      )
                    }
                    placeholder="contoh: 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch_start">Tanggal Mulai Batch</Label>
                  <Input
                    id="batch_start"
                    type="date"
                    value={formData.batch_start_date || ""}
                    onChange={(e) =>
                      handleInputChange("batch_start_date", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch_end">Tanggal Akhir Batch</Label>
                  <Input
                    id="batch_end"
                    type="date"
                    value={formData.batch_end_date || ""}
                    onChange={(e) =>
                      handleInputChange("batch_end_date", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Masukkan lokasi"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {formData.type === Programs.FUNDING && (
          <Card>
            <CardHeader>
              <CardTitle>Detail Pendanaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_amount">Jumlah Minimum (IDR)</Label>
                  <Input
                    id="min_amount"
                    type="number"
                    value={formData.min_amount || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "min_amount",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="contoh: 5000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_amount">Jumlah Maksimum (IDR)</Label>
                  <Input
                    id="max_amount"
                    type="number"
                    value={formData.max_amount || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "max_amount",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="contoh: 500000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interest_rate">Suku Bunga (%)</Label>
                  <Input
                    id="interest_rate"
                    type="number"
                    step="0.01"
                    value={formData.interest_rate || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "interest_rate",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="contoh: 6.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_tenure">Tenor Maksimal (Bulan)</Label>
                  <Input
                    id="max_tenure"
                    type="number"
                    value={formData.max_tenure_months || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "max_tenure_months",
                        Number.parseInt(e.target.value)
                      )
                    }
                    placeholder="contoh: 36"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Gambar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Banner Program (rasio 2:3) *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  {bannerPreview ? (
                    <div className="space-y-2">
                      <img
                        src={bannerPreview || "/placeholder.svg"}
                        alt="Pratinjau banner"
                        className="w-full h-48 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBannerPreview("");
                          handleInputChange("banner", "");
                        }}
                        disabled={isUploading}
                      >
                        Hapus
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-2">
                        <Label
                          htmlFor="banner-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-sm text-muted-foreground">
                            {isUploading
                              ? "Mengupload..."
                              : "Klik untuk upload banner"}
                          </span>
                          <Input
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("banner", file);
                            }}
                          />
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo Penyedia (rasio 1:1) *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  {logoPreview ? (
                    <div className="space-y-2">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Pratinjau logo"
                        className="w-24 h-24 object-cover rounded mx-auto"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLogoPreview("");
                          handleInputChange("provider_logo", "");
                        }}
                        disabled={isUploading}
                      >
                        Hapus
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-2">
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <span className="text-sm text-muted-foreground">
                            {isUploading
                              ? "Mengupload..."
                              : "Klik untuk upload logo"}
                          </span>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("provider_logo", file);
                            }}
                          />
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Manfaat
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBenefit}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Manfaat
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData?.benefits?.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Belum ada manfaat yang ditambahkan.
              </p>
            ) : (
              formData?.benefits?.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Masukkan deskripsi manfaat"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Persyaratan
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Persyaratan
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData?.requirements?.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Belum ada persyaratan yang ditambahkan.
              </p>
            ) : (
              formData?.requirements?.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="Masukkan deskripsi persyaratan"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/programs/${formData.type}`)}
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
                ? "Perbarui Program"
                : "Buat Program"}
          </Button>
        </div>
      </form>
    </div>
  );
}
