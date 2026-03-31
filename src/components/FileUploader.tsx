import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Image, X, Loader2, CheckCircle2 } from "lucide-react";

interface FileUploaderProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

export default function FileUploader({ onAnalyze, isAnalyzing }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const isPdf = file?.type === "application/pdf";

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleSelect}
          className="hidden"
        />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
        <p className="font-display font-semibold text-foreground">
          Drop your medical report here
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Supports PDF, JPG, PNG — Blood reports, X-rays, MRI scans
        </p>
      </div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {isPdf ? (
              <FileText className="w-8 h-8 text-medical-info" />
            ) : (
              <Image className="w-8 h-8 text-medical-success" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFile(null)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <button
        disabled={!file || isAnalyzing}
        onClick={() => file && onAnalyze(file)}
        className="w-full py-3 rounded-xl font-display font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Report...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" /> Analyze with AI
          </>
        )}
      </button>
    </div>
  );
}
