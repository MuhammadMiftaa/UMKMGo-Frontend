"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Percent,
  Clock,
} from "lucide-react";
import { usePrograms } from "../../contexts/ProgramContext";
import { Programs } from "../../lib/const";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getProgramById,
    currentProgram: program,
    deleteProgram,
    activateProgram,
    deactivateProgram,
  } = usePrograms();

  const [isActive, setIsActive] = useState(program?.is_active || false);

  useEffect(() => {
    if (id) {
      getProgramById(Number(id));
    }
  }, [id]);

  if (!program) {
    return (
      <div className="space-y-6">
        <div className="flex items-top gap-4">
          <h1 className="text-3xl font-bold">Program Not Found</h1>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              The program you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteProgram(Number(id));
    }
  };

  const handleToggleActive = (checked: boolean) => {
    setIsActive(checked);
    if (checked) activateProgram(Number(id));
    else deactivateProgram(Number(id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-top gap-4">
          <div>
            <h1 className="text-3xl font-bold">{program.title}</h1>
            <p className="text-muted-foreground">Program Details</p>
          </div>
          <Link to={`/programs/${program.type}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link to={`/programs/${program.type}/${program.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Program Banner */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={program.banner || "/placeholder.svg"}
              alt={program.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="absolute top-4 right-4"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={program.provider_logo || "/placeholder.svg"}
                  alt={program.provider}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{program.provider}</p>
                  <Badge variant="outline" className="capitalize">
                    {program.type}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{program.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created By</p>
                  <p className="font-medium">{program.created_by_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {program.created_at
                      ? new Date(program.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training/Certification Details */}
          {(program.type === Programs.TRAINING ||
            program.type === Programs.CERTIFICATION) && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {program.type} Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.training_type && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {program.training_type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Type
                      </span>
                    </div>
                  )}
                  {program.batch && (
                    <div className="flex items-center gap-2">
                      <Badge>Batch #{program.batch}</Badge>
                    </div>
                  )}
                </div>

                {program.batch_start_date && program.batch_end_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(program.batch_start_date).toLocaleDateString(
                        "id-ID"
                      )}{" "}
                      -{" "}
                      {new Date(program.batch_end_date).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                )}

                {program.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{program.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Funding Details */}
          {program.type === Programs.FUNDING && (
            <Card>
              <CardHeader>
                <CardTitle>Funding Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.min_amount && program.max_amount && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatCurrency(program.min_amount)} -{" "}
                        {formatCurrency(program.max_amount)}
                      </span>
                    </div>
                  )}
                  {program.interest_rate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span>{program.interest_rate}% Interest Rate</span>
                    </div>
                  )}
                </div>

                {program.max_tenure_months && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Max {program.max_tenure_months} months tenure</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {program.benefits && program.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {program.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {program.requirements && program.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {program.requirements.map((requirement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="active-toggle">Active Status</Label>
                <Switch
                  id="active-toggle"
                  checked={isActive}
                  onCheckedChange={handleToggleActive}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {isActive
                  ? "Program is currently active and accepting applications."
                  : "Program is inactive and not accepting applications."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Deadline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(program.application_deadline).toLocaleDateString(
                    "id-ID"
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
