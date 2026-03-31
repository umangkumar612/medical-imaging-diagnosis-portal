import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FileUploader from "@/components/FileUploader";
import AnalysisReport from "@/components/AnalysisReport";
import { analyzeReport, addToHistory, type AnalysisResult } from "@/lib/medicalEngine";

export default function UploadPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async (file: File) => {
    setAnalyzing(true);
    setResult(null);
    // Simulate processing time
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));
    const analysis = analyzeReport(file.name);
    addToHistory(analysis);
    setResult(analysis);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Upload Medical Report</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Upload your report and receive instant AI-powered analysis
          </p>
          <FileUploader onAnalyze={handleAnalyze} isAnalyzing={analyzing} />
        </motion.div>

        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
            <div className="glass-card p-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
              <p className="font-display font-semibold text-foreground">Analyzing your report...</p>
              <p className="text-sm text-muted-foreground mt-1">Extracting data and running AI analysis</p>
            </div>
          </motion.div>
        )}

        {result && (
          <div className="mt-8">
            <AnalysisReport result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
