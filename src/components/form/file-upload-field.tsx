"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, File, Loader2 } from "lucide-react";
import { storageService } from "@/lib/storage";
import type { UploadedFile } from "@/types/file.types";

interface FileUploadFieldProps {
    formId: string;
    fieldId: string;
    value?: UploadedFile;
    onChange: (file: UploadedFile | null) => void;
    disabled?: boolean;
    maxSize?: number;
}

/**
 * File Upload Field - Reusable component
 */
export function FileUploadField({
    formId,
    fieldId,
    value,
    onChange,
    disabled,
    maxSize = 5,
}: FileUploadFieldProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        const validation = storageService.validate(file, maxSize);
        if (!validation.valid) {
            setError(validation.error || "Invalid file");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const uploaded = await storageService.upload(file, formId, fieldId);
            onChange(uploaded);
        } catch (err) {
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleRemove = async () => {
        if (value?.path) {
            try {
                await storageService.delete(value.path);
            } catch {
                // Ignore delete errors
            }
        }
        onChange(null);
    };

    return (
        <div className="space-y-2">
            {!value ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${disabled || uploading ? "opacity-50" : "hover:border-primary cursor-pointer"
                        }`}
                    onClick={() => !disabled && !uploading && inputRef.current?.click()}
                >
                    {uploading ? (
                        <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                    ) : (
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground">
                        {uploading ? "Uploading..." : `Click to upload (max ${maxSize}MB)`}
                    </p>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <File className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{value.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {storageService.formatSize(value.size)}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemove}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                disabled={disabled || uploading}
            />
        </div>
    );
}
