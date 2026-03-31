import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Upload, Brain, Shield, MessageCircle, BarChart3, ArrowRight, Zap } from "lucide-react";

const features = [
  { icon: Upload, title: "Upload Reports", desc: "PDF, X-ray, MRI, or blood test — just drag and drop." },
  { icon: Brain, title: "AI Analysis", desc: "Instant AI-powered analysis with detected conditions and severity." },
  { icon: BarChart3, title: "Health Tracking", desc: "Track your results over time and monitor trends." },
  { icon: MessageCircle, title: "Medical Chatbot", desc: "Ask health questions and get simple, clear answers." },
  { icon: Shield, title: "Secure & Private", desc: "Your medical data is encrypted and never shared." },
  { icon: Zap, title: "Instant Results", desc: "Get your analysis in seconds, not days." },
];

export default function Landing() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-medical-info/10 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Activity className="w-3.5 h-3.5" /> AI-Powered Medical Analysis
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Your Health Reports,{" "}
              <span className="text-gradient">Decoded by AI</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Upload medical reports and receive instant AI analysis with detected conditions, explanations, and health guidance — all in simple language.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 glow"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold hover:bg-secondary/80 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-foreground">How It Works</h2>
          <p className="text-muted-foreground mt-2">Simple, fast, and reliable medical report analysis</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">MediScan</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MediScan. For informational purposes only — not medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
