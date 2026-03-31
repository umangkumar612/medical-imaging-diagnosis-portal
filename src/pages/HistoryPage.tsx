import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { getHistory } from "@/lib/medicalEngine";
import AnalysisReport from "@/components/AnalysisReport";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const history = getHistory();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Report History</h1>
          <p className="text-sm text-muted-foreground mb-6">View and expand past analyses</p>

          {history.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-display font-semibold text-foreground">No history yet</p>
              <Link to="/upload" className="inline-block mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                Upload Report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((r) => {
                const isOpen = expandedId === r.id;
                const statusConfig = {
                  normal: { label: "Normal", color: "text-medical-success", bg: "bg-medical-success/10" },
                  attention: { label: "Attention", color: "text-medical-warning", bg: "bg-medical-warning/10" },
                  critical: { label: "Critical", color: "text-medical-danger", bg: "bg-medical-danger/10" },
                };
                const s = statusConfig[r.overallStatus];

                return (
                  <div key={r.id} className="glass-card overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isOpen ? null : r.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{r.reportType}</p>
                          <p className="text-xs text-muted-foreground">{r.date} • {r.confidence}% confidence</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border/30"
                        >
                          <div className="p-4">
                            <AnalysisReport result={r} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
