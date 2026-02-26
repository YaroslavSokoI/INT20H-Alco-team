import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { importIcon, file as fileIcon } from "@/assets/assets.ts";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File) => Promise<void>;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.csv')) {
            setFile(droppedFile);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;
        setIsLoading(true);
        try {
            await onImport(file);
            onClose();
            setFile(null);
        } catch (error) {
            console.error("Import failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Import CSV File</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                </div>

                <div 
                    className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                        isDragging ? 'border-primary bg-primary/5' : 'border-border bg-surface/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        accept=".csv" 
                        className="hidden" 
                    />
                    
                    {!file ? (
                        <>
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <img src={importIcon} alt="" className="size-8" />
                            </div>
                            <p className="text-sm font-medium text-text text-center">
                                Drag and drop your CSV file here or{' '}
                                <button 
                                    className="text-primary hover:underline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    browse
                                </button>
                            </p>
                            <p className="text-xs text-text-muted mt-2">Maximum file size: 10MB</p>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                <img src={fileIcon} alt="" className="size-8" />
                            </div>
                            <p className="text-sm font-bold text-text truncate max-w-[250px]">{file.name}</p>
                            <p className="text-xs text-text-muted mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                            <button 
                                className="text-xs text-danger mt-4 hover:underline"
                                onClick={() => setFile(null)}
                            >
                                Remove file
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button 
                        disabled={!file} 
                        isLoading={isLoading} 
                        onClick={handleSubmit}
                        className="px-8"
                    >
                        Upload & Import
                    </Button>
                </div>
            </div>
        </div>
    );
}
