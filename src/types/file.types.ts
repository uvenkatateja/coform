/**
 * File Upload Types
 */

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    path: string;
}

export interface FileFieldConfig {
    maxSize: number; // in MB
    allowedTypes: string[]; // e.g., ["image/*", "application/pdf"]
}

export const DEFAULT_FILE_CONFIG: FileFieldConfig = {
    maxSize: 5,
    allowedTypes: ["image/*", "application/pdf", ".doc", ".docx"],
};
