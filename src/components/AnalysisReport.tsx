import { motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, AlertCircle, Heart, Apple, Stethoscope,
  Shield, TrendingUp, TrendingDown, Minus, FileText,
} from "lucide-react";
import { type AnalysisResult } from "@/lib/medicalEngine";

const statusConfig = {
  normal: { label: "Normal", icon: CheckCircle2, color: "text-medical-success", bg: "bg-medical-success/10" },
  attention: { label: "Needs Attention", icon: AlertCircle, color: "text-medical-warning", bg: "bg-medical-warning/10" },
  critical: { label: "Critical", icon: AlertTriangle, color: "text-medical-danger", bg: "bg-medical-danger/10" },
};

const severityColor = {
  Low: "bg-medical-success/10 text-medical-success",
  Medium: "bg-medical-warning/10 text-medical-warning",
  High: "bg-medical-danger/10 text-medical-danger",
};

const valueIcon = {
  normal: <Minus className="w-4 h-4 text-medical-success" />,
  high: <TrendingUp className="w-4 h-4 text-medical-danger" />,
  low: <TrendingDown className="w-4 h-4 text-medical-warning" />,
};

export default function AnalysisReport({ result }: { result: AnalysisResult }) {
  const status = statusConfig[result.overallStatus];
  const StatusIcon = status.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Disclaimer */}
      <div className="glass-card p-4 border-l-4 border-medical-warning">
        <p className="text-xs text-muted-foreground">
          <strong className="text-medical-warning">⚠️ Disclaimer:</strong> This AI analysis is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.
        </p>
      </div>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Patient Summary</h2>
            <p className="text-sm text-muted-foreground mt-1">{result.reportType} • {result.date}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bg}`}>
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">{result.confidence}% confidence</span>
        </div>
        <p className="mt-4 text-sm text-secondary-foreground">{result.summary}</p>
      </div>

      {/* Conditions */}
      {result.detectedConditions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" /> Detected Conditions
          </h3>
          {result.detectedConditions.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-semibold text-foreground">{c.name}</h4>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${severityColor[c.severity]}`}>
                  {c.severity} Severity
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{c.explanation}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> Precautions</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {c.precautions.map((p, j) => <li key={j}>• {p}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1"><FileText className="w-3 h-3 text-primary" /> Recommended Tests</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {c.recommendedTests.map((t, j) => <li key={j}>• {t}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Blood Values */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-foreground">Blood Values</h3>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Parameter</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Value</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Normal Range</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.bloodValues.map((v, i) => (
                  <tr key={i} className="border-b border-border/20 last:border-0">
                    <td className="px-4 py-2.5 text-foreground font-medium">{v.name}</td>
                    <td className="px-4 py-2.5 text-right text-foreground">{v.value} <span className="text-muted-foreground text-xs">{v.unit}</span></td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">{v.normalRange.min}–{v.normalRange.max}</td>
                    <td className="px-4 py-2.5 text-center">{valueIcon[v.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lifestyle & Diet */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-medical-danger" /> Lifestyle Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.lifestyle.map((l, i) => <li key={i}>• {l}</li>)}
          </ul>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Apple className="w-5 h-5 text-medical-success" /> Diet Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.dietTips.map((d, i) => <li key={i}>• {d}</li>)}
          </ul>
        </div>
      </div>

      {result.consultDoctor && (
        <div className="glass-card p-5 border-l-4 border-medical-info">
          <p className="font-display font-semibold text-foreground flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-medical-info" /> Doctor Consultation Recommended
          </p>
          <p className="text-sm text-muted-foreground mt-1">Based on the analysis, we recommend scheduling an appointment with a healthcare professional for further evaluation.</p>
        </div>
      )}
    </motion.div>
  );
}
