"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import type {
  ProgramType,
  TrainingType,
  CreateProgramData,
} from "../../types/program";

export default function CreateProgramPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programType = (searchParams.get("type") as ProgramType) || "TRAINING";

  const [formData, setFormData] = useState<CreateProgramData>({
    title: "",
    description: "",
    banner: "",
    provider: "",
    provider_logo: "",
    type: programType,
    application_deadline: "",
    is_active: true,
    benefits: [],
    requirements: [],
  });

  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleInputChange = (field: keyof CreateProgramData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: "banner" | "provider_logo", file: File) => {
    const url = URL.createObjectURL(file);
    handleInputChange(field, file);

    if (field === "banner") {
      setBannerPreview(url);
    } else {
      setLogoPreview(url);
    }
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { name: "" }],
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const updateBenefit = (index: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) =>
        i === index ? { name } : benefit
      ),
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, { name: "" }],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const updateRequirement = (index: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? { name } : req
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log("Creating program:", formData);

    // Navigate back to the appropriate list page
    const listPath = {
      TRAINING: "/programs/trainings",
      CERTIFICATION: "/programs/certifications",
      FUNDING: "/programs/fundings",
    }[formData.type];

    navigate(listPath);
  };

  const getBackPath = () => {
    return {
      TRAINING: "/programs/trainings",
      CERTIFICATION: "/programs/certifications",
      FUNDING: "/programs/fundings",
    }[formData.type];
  };

  const getProgramTypeLabel = () => {
    return {
      TRAINING: "Training",
      CERTIFICATION: "Certification",
      FUNDING: "Funding",
    }[formData.type];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center w-full justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Create {getProgramTypeLabel()} Program
          </h1>
          <p className="text-muted-foreground">
            Add a new {formData.type.toLowerCase()} program
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(getBackPath())}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Program Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter program title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) =>
                    handleInputChange("provider", e.target.value)
                  }
                  placeholder="Enter provider name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter program description"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Program Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ProgramType) =>
                    handleInputChange("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRAINING">Training</SelectItem>
                    <SelectItem value="CERTIFICATION">Certification</SelectItem>
                    <SelectItem value="FUNDING">Funding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
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
              <Label htmlFor="is_active">Active Program</Label>
            </div>
          </CardContent>
        </Card>

        {/* Training/Certification Specific Fields */}
        {(formData.type === "TRAINING" ||
          formData.type === "CERTIFICATION") && (
          <Card>
            <CardHeader>
              <CardTitle>
                {formData.type === "TRAINING" ? "Training" : "Certification"}{" "}
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="training_type">Type</Label>
                  <Select
                    value={formData.training_type}
                    onValueChange={(value: TrainingType) =>
                      handleInputChange("training_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
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
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch_start">Batch Start Date</Label>
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
                  <Label htmlFor="batch_end">Batch End Date</Label>
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
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Enter location"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Funding Specific Fields */}
        {formData.type === "FUNDING" && (
          <Card>
            <CardHeader>
              <CardTitle>Funding Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_amount">Minimum Amount (IDR)</Label>
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
                    placeholder="e.g., 5000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_amount">Maximum Amount (IDR)</Label>
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
                    placeholder="e.g., 500000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interest_rate">Interest Rate (%)</Label>
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
                    placeholder="e.g., 6.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_tenure">Max Tenure (Months)</Label>
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
                    placeholder="e.g., 36"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Program Banner (2:3 ratio) *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  {bannerPreview ? (
                    <div className="space-y-2">
                      <img
                        src={bannerPreview || "/placeholder.svg"}
                        alt="Banner preview"
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
                      >
                        Remove
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
                            Click to upload banner
                          </span>
                          <Input
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
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
                <Label>Provider Logo (1:1 ratio) *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  {logoPreview ? (
                    <div className="space-y-2">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
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
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-2">
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <span className="text-sm text-muted-foreground">
                            Click to upload logo
                          </span>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
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

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Benefits
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBenefit}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.benefits.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No benefits added yet.
              </p>
            ) : (
              formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit.name}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Enter benefit description"
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

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Requirements
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.requirements.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No requirements added yet.
              </p>
            ) : (
              formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement.name}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="Enter requirement description"
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

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(getBackPath())}
          >
            Cancel
          </Button>
          <Button type="submit">Save Program</Button>
        </div>
      </form>
    </div>
  );
}
