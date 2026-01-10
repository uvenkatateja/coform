"use client";

import { Button } from "@/components/ui/button";
import { SubmissionCard } from "./submission-card";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/submissions/export";
import type { Database } from "@/types/database.types";

type Form = Database["public"]["Tables"]["forms"]["Row"];
type Submission = Database["public"]["Tables"]["submissions"]["Row"];

interface SubmissionsClientProps {
  form: Form;
  submissions: Submission[];
}

export function SubmissionsClient({ form, submissions }: SubmissionsClientProps) {
  const handleExportCSV = () => {
    const csv = exportToCSV(submissions);
    downloadFile(csv, `${form.title}-responses.csv`, "text/csv");
  };

  const handleExportJSON = () => {
    const json = exportToJSON(submissions);
    downloadFile(json, `${form.title}-responses.json`, "application/json");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold md:text-xl">
              {form.title} - Responses
            </h1>
          </div>
          {submissions.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">CSV</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJSON}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">JSON</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {submissions.length} {submissions.length === 1 ? "response" : "responses"}
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-lg border p-8 text-center md:p-12">
            <p className="text-muted-foreground">No responses yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
