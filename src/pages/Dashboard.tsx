import { motion } from "framer-motion";
import { Activity, FileText, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { getHistory } from "@/lib/medicalEngine";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Dashboard() {
  const history = getHistory();

  const chartData = history.slice(0, 10).reverse().map((r, i) => ({
    name: `Report ${i + 1}`,
    confidence: r.confidence,
    abnormals: r.bloodValues.filter((v) => v.status !== "normal").length,
  }));

  const totalReports = history.length;
  const criticalCount = history.filter((r) => r.overallStatus === "critical").length;
  const normalCount = history.filter((r) => r.overallStatus === "normal").length;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Reports", value: totalReports, icon: FileText, color: "text-primary" },
              { label: "Normal Results", value: normalCount, icon: CheckCircle2, color: "text-medical-success" },
              { label: "Critical Alerts", value: criticalCount, icon: AlertTriangle, color: "text-medical-danger" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="glass-card p-6 mb-8">
              <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Health Trend
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(222,44%,9%)", border: "1px solid hsl(222,30%,18%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                  <Line type="monotone" dataKey="confidence" stroke="hsl(174,72%,46%)" strokeWidth={2} dot={{ fill: "hsl(174,72%,46%)" }} />
                  <Line type="monotone" dataKey="abnormals" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={{ fill: "hsl(38,92%,50%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {history.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-display font-semibold text-foreground">No reports yet</p>
              <p className="text-sm text-muted-foreground mt-1">Upload your first medical report to get started</p>
              <Link to="/upload" className="inline-block mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Upload Report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="font-display font-semibold text-foreground">Recent Reports</h2>
              {history.slice(0, 5).map((r) => {
                const statusConfig = {
                  normal: { label: "Normal", color: "text-medical-success", bg: "bg-medical-success/10" },
                  attention: { label: "Attention", color: "text-medical-warning", bg: "bg-medical-warning/10" },
                  critical: { label: "Critical", color: "text-medical-danger", bg: "bg-medical-danger/10" },
                };
                const s = statusConfig[r.overallStatus];
                return (
                  <div key={r.id} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.reportType}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.bg} ${s.color}`}>{s.label}</span>
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
