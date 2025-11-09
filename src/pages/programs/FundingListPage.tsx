"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, Plus } from "lucide-react";
import { usePrograms } from "../../contexts/ProgramContext";
import { Programs } from "../../lib/const";

export default function FundingListPage() {
  const { getAllPrograms, programs } = usePrograms();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fundingPrograms = programs.filter(
    (program) => program.type === Programs.FUNDING
  );

  const filteredPrograms = fundingPrograms.filter((program) => {
    const matchesSearch = program.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && program.is_active) ||
      (statusFilter === "inactive" && !program.is_active);
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    getAllPrograms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Funding Programs</h1>
          <p className="text-muted-foreground">
            Manage funding programs for UMKM development
          </p>
        </div>
        <Link to={`/programs/funding/create?type=${Programs.FUNDING}`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={program.banner || "/placeholder.svg"}
                alt={program.title}
                className="w-full h-48 object-cover"
              />
              <Badge
                variant={program.is_active ? "default" : "secondary"}
                className="absolute top-2 right-2"
              >
                {program.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={program.provider_logo || "/placeholder.svg"}
                  alt={program.provider}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  {program.provider}
                </span>
              </div>
              <h3 className="font-semibold text-lg leading-tight">
                {program.title}
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {program.description.length > 150
                  ? `${program.description.substring(0, 150)}...`
                  : program.description}
              </p>
              <div className="text-xs text-muted-foreground mb-4">
                <p>
                  Created:{" "}
                  {program.created_at
                    ? new Date(program.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </p>
                <p>By: {program.created_by}</p>
              </div>
              <div className="flex justify-end">
                <Link to={`/programs/funding/${program.id}`}>
                  <Button variant="outline" size="sm">
                    Detail
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No funding programs found.</p>
        </div>
      )}
    </div>
  );
}
