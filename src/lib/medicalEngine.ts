// Simulated Medical AI Analysis Engine
// Rule-based logic for demo purposes — NOT a real medical tool

export interface BloodValue {
  name: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  status: "normal" | "low" | "high";
}

export interface AnalysisResult {
  id: string;
  patientName: string;
  date: string;
  reportType: string;
  overallStatus: "normal" | "attention" | "critical";
  confidence: number;
  detectedConditions: {
    name: string;
    severity: "Low" | "Medium" | "High";
    explanation: string;
    precautions: string[];
    recommendedTests: string[];
  }[];
  bloodValues: BloodValue[];
  lifestyle: string[];
  dietTips: string[];
  consultDoctor: boolean;
  summary: string;
}

const NORMAL_RANGES: Record<string, { min: number; max: number; unit: string }> = {
  hemoglobin: { min: 12, max: 17.5, unit: "g/dL" },
  wbc: { min: 4000, max: 11000, unit: "cells/mcL" },
  rbc: { min: 4.5, max: 5.5, unit: "million/mcL" },
  platelets: { min: 150000, max: 400000, unit: "cells/mcL" },
  glucose: { min: 70, max: 100, unit: "mg/dL" },
  cholesterol: { min: 0, max: 200, unit: "mg/dL" },
  creatinine: { min: 0.7, max: 1.3, unit: "mg/dL" },
  alt: { min: 7, max: 56, unit: "U/L" },
  ast: { min: 10, max: 40, unit: "U/L" },
  tsh: { min: 0.4, max: 4.0, unit: "mIU/L" },
  vitaminD: { min: 30, max: 100, unit: "ng/mL" },
  iron: { min: 60, max: 170, unit: "mcg/dL" },
};

function generateMockBloodValues(): BloodValue[] {
  return Object.entries(NORMAL_RANGES).map(([key, range]) => {
    const deviation = Math.random();
    let value: number;
    if (deviation < 0.6) {
      value = range.min + Math.random() * (range.max - range.min);
    } else if (deviation < 0.8) {
      value = range.min * (0.5 + Math.random() * 0.4);
    } else {
      value = range.max * (1.1 + Math.random() * 0.5);
    }
    value = Math.round(value * 100) / 100;

    const status: BloodValue["status"] =
      value < range.min ? "low" : value > range.max ? "high" : "normal";

    const nameMap: Record<string, string> = {
      hemoglobin: "Hemoglobin",
      wbc: "White Blood Cells",
      rbc: "Red Blood Cells",
      platelets: "Platelets",
      glucose: "Fasting Glucose",
      cholesterol: "Total Cholesterol",
      creatinine: "Creatinine",
      alt: "ALT (Liver)",
      ast: "AST (Liver)",
      tsh: "TSH (Thyroid)",
      vitaminD: "Vitamin D",
      iron: "Serum Iron",
    };

    return {
      name: nameMap[key] || key,
      value,
      unit: range.unit,
      normalRange: range,
      status,
    };
  });
}

const CONDITIONS_DB = [
  {
    trigger: (vals: BloodValue[]) => vals.find((v) => v.name === "Hemoglobin" && v.status === "low"),
    name: "Iron Deficiency Anemia",
    severity: "Medium" as const,
    explanation: "Your hemoglobin levels are below normal range, which may indicate anemia. This means your blood may not carry enough oxygen to your body's tissues.",
    precautions: ["Increase iron-rich foods", "Take iron supplements as advised", "Avoid tea/coffee with meals"],
    recommendedTests: ["Serum Ferritin", "Iron Studies", "Peripheral Blood Smear"],
  },
  {
    trigger: (vals: BloodValue[]) => vals.find((v) => v.name === "Fasting Glucose" && v.status === "high"),
    name: "Elevated Blood Sugar",
    severity: "High" as const,
    explanation: "Your fasting glucose is above the normal range. This could indicate prediabetes or diabetes. Early detection and lifestyle changes can make a significant difference.",
    precautions: ["Monitor blood sugar regularly", "Reduce refined sugar intake", "Exercise for 30 min daily"],
    recommendedTests: ["HbA1c", "Oral Glucose Tolerance Test", "Fasting Insulin"],
  },
  {
    trigger: (vals: BloodValue[]) => vals.find((v) => v.name === "Total Cholesterol" && v.status === "high"),
    name: "Hypercholesterolemia",
    severity: "Medium" as const,
    explanation: "Your cholesterol levels are elevated. High cholesterol increases the risk of heart disease and stroke over time.",
    precautions: ["Reduce saturated fat intake", "Increase fiber consumption", "Regular cardiovascular exercise"],
    recommendedTests: ["LDL/HDL Panel", "Lipid Profile", "Cardiac Risk Assessment"],
  },
  {
    trigger: (vals: BloodValue[]) => vals.find((v) => v.name === "TSH (Thyroid)" && v.status !== "normal"),
    name: "Thyroid Imbalance",
    severity: "Low" as const,
    explanation: "Your TSH levels are outside the normal range, which may indicate a thyroid disorder. The thyroid gland regulates metabolism, energy, and mood.",
    precautions: ["Monitor symptoms like fatigue or weight changes", "Follow up with an endocrinologist"],
    recommendedTests: ["Free T3", "Free T4", "Thyroid Antibodies"],
  },
  {
    trigger: (vals: BloodValue[]) => vals.find((v) => v.name === "Vitamin D" && v.status === "low"),
    name: "Vitamin D Deficiency",
    severity: "Low" as const,
    explanation: "Your Vitamin D level is low. This is common and can affect bone health, immunity, and mood.",
    precautions: ["Get 15-20 min of sunlight daily", "Consider Vitamin D3 supplements", "Include fortified foods"],
    recommendedTests: ["Calcium levels", "Parathyroid Hormone", "Bone Density Scan"],
  },
];

export function analyzeReport(fileName: string): AnalysisResult {
  const bloodValues = generateMockBloodValues();
  const abnormalCount = bloodValues.filter((v) => v.status !== "normal").length;

  const detectedConditions = CONDITIONS_DB
    .filter((c) => c.trigger(bloodValues))
    .map(({ trigger, ...rest }) => rest);

  const overallStatus: AnalysisResult["overallStatus"] =
    detectedConditions.some((c) => c.severity === "High")
      ? "critical"
      : abnormalCount > 3
      ? "attention"
      : "normal";

  const confidence = 72 + Math.floor(Math.random() * 20);

  return {
    id: crypto.randomUUID(),
    patientName: "Patient",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    reportType: fileName.endsWith(".pdf") ? "Blood Report (PDF)" : "Medical Image",
    overallStatus,
    confidence,
    detectedConditions,
    bloodValues,
    lifestyle: [
      "Aim for 7-8 hours of quality sleep each night",
      "Practice stress management through meditation or yoga",
      "Stay hydrated — drink 8-10 glasses of water daily",
      "Engage in 150 minutes of moderate exercise per week",
      "Limit alcohol consumption and avoid smoking",
    ],
    dietTips: [
      "Include leafy greens and colorful vegetables in every meal",
      "Choose whole grains over refined carbohydrates",
      "Add omega-3 rich foods like fish, walnuts, and flaxseeds",
      "Limit processed foods and added sugars",
      "Eat a balanced breakfast to stabilize blood sugar",
    ],
    consultDoctor: overallStatus !== "normal",
    summary: overallStatus === "normal"
      ? "Your results look generally healthy. Continue maintaining your current lifestyle."
      : overallStatus === "attention"
      ? "Some values need attention. Consider lifestyle modifications and follow-up testing."
      : "Critical values detected. Please consult a healthcare professional promptly for further evaluation.",
  };
}

// Chatbot logic
const CHATBOT_RESPONSES: { patterns: RegExp[]; response: string }[] = [
  {
    patterns: [/headache/i, /head.*pain/i, /migraine/i],
    response: "Headaches can have many causes including stress, dehydration, lack of sleep, or eye strain. **General tips:**\n- Stay hydrated\n- Take regular breaks from screens\n- Ensure adequate sleep\n- Try over-the-counter pain relievers\n\n⚠️ If headaches are severe, sudden, or persistent, please consult a doctor.",
  },
  {
    patterns: [/blood.*pressure/i, /bp/i, /hypertension/i],
    response: "Normal blood pressure is around **120/80 mmHg**.\n- **Elevated:** 120-129/<80\n- **Stage 1 Hypertension:** 130-139/80-89\n- **Stage 2 Hypertension:** ≥140/≥90\n\n**Tips:** Reduce salt, exercise regularly, manage stress, limit alcohol.",
  },
  {
    patterns: [/diabetes/i, /sugar.*level/i, /glucose/i, /blood.*sugar/i],
    response: "**Normal fasting glucose** is 70-100 mg/dL.\n- **Prediabetes:** 100-125 mg/dL\n- **Diabetes:** ≥126 mg/dL\n\n**Management tips:** Monitor regularly, eat balanced meals, exercise, maintain healthy weight.",
  },
  {
    patterns: [/cholesterol/i, /lipid/i],
    response: "**Desirable cholesterol levels:**\n- Total: <200 mg/dL\n- LDL (bad): <100 mg/dL\n- HDL (good): >60 mg/dL\n\n**Tips:** Eat heart-healthy fats, exercise, increase fiber, limit saturated fats.",
  },
  {
    patterns: [/anemia/i, /iron/i, /hemoglobin/i],
    response: "Anemia occurs when hemoglobin is below normal (12-17.5 g/dL for adults). **Symptoms:** fatigue, weakness, pale skin, shortness of breath.\n\n**Iron-rich foods:** spinach, red meat, lentils, fortified cereals. Pair with Vitamin C for better absorption.",
  },
  {
    patterns: [/thyroid/i, /tsh/i],
    response: "**Normal TSH:** 0.4-4.0 mIU/L\n- **Hypothyroid (high TSH):** fatigue, weight gain, cold sensitivity\n- **Hyperthyroid (low TSH):** anxiety, weight loss, rapid heartbeat\n\nThyroid conditions are very manageable with proper medication.",
  },
  {
    patterns: [/vitamin.*d/i, /vit.*d/i],
    response: "**Normal Vitamin D:** 30-100 ng/mL. Deficiency is very common.\n\n**Boost Vitamin D:**\n- 15-20 min sunlight daily\n- Fatty fish, egg yolks, fortified milk\n- Supplements (D3 preferred) as recommended by your doctor.",
  },
  {
    patterns: [/hello|hi|hey/i],
    response: "Hello! 👋 I'm your Medical Guide assistant. I can help explain medical terms, discuss common health topics, and provide general wellness advice.\n\n**Try asking about:**\n- Blood pressure, diabetes, cholesterol\n- Common symptoms like headaches or fatigue\n- Diet and lifestyle tips\n\n⚠️ *I'm not a doctor — always consult a healthcare professional for medical advice.*",
  },
  {
    patterns: [/thank/i],
    response: "You're welcome! Remember, I'm here to provide general information only. For any medical concerns, please consult a qualified healthcare professional. Stay healthy! 💪",
  },
  {
    patterns: [/fatigue|tired|exhaustion/i],
    response: "Chronic fatigue can be caused by:\n- Sleep disorders\n- Anemia or thyroid issues\n- Vitamin deficiencies (D, B12, Iron)\n- Stress or depression\n- Poor diet\n\n**Tips:** Prioritize sleep, stay hydrated, eat balanced meals, exercise moderately. If fatigue persists >2 weeks, see a doctor.",
  },
];

export function getChatResponse(message: string): string {
  for (const entry of CHATBOT_RESPONSES) {
    if (entry.patterns.some((p) => p.test(message))) {
      return entry.response;
    }
  }
  return "I can help with general health questions about blood pressure, diabetes, cholesterol, anemia, thyroid, vitamins, and common symptoms.\n\n**Try asking:**\n- \"What is normal blood pressure?\"\n- \"Tell me about diabetes\"\n- \"How to manage cholesterol?\"\n\n⚠️ *This is for educational purposes only. Not a substitute for professional medical advice.*";
}

// Mock auth
export interface User {
  id: string;
  name: string;
  email: string;
}

let currentUser: User | null = null;
const reportHistory: AnalysisResult[] = [];

export function mockLogin(email: string, password: string): User | null {
  if (email && password.length >= 6) {
    currentUser = { id: crypto.randomUUID(), name: email.split("@")[0], email };
    return currentUser;
  }
  return null;
}

export function mockSignup(name: string, email: string, password: string): User | null {
  if (name && email && password.length >= 6) {
    currentUser = { id: crypto.randomUUID(), name, email };
    return currentUser;
  }
  return null;
}

export function mockLogout() {
  currentUser = null;
}

export function getUser() {
  return currentUser;
}

export function addToHistory(result: AnalysisResult) {
  reportHistory.unshift(result);
}

export function getHistory() {
  return reportHistory;
}
