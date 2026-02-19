# CapitalizeAI

> **L'Infrastructure Financière Intelligente de l'Afrique**

AI-powered credit scoring, unified payment aggregation, fraud detection, and financial inclusion for 400M+ unbanked Africans.

## 🚀 Overview

CapitalizeAI is an integrated fintech platform modeled after the **Ant Financial flywheel**, targeting the Central African (CEMAC) market. Our AI engine transforms Mobile Money transaction data into actionable credit scores, unifies fragmented payment systems, and redirects unproductive capital into micro-investments.

## 🧠 Core Modules

| Module | Description | Phase |
|--------|------------|-------|
| **ScorAI** | AI credit scoring using GNN + Bayesian ML on MoMo data | Phase 1 |
| **PayGate** | Unified payment API (MTN MoMo, Orange Money, Visa) | Phase 2 |
| **FraudShield** | Real-time AI fraud detection & eKYC | Phase 2 |
| **SmartBet** | Redirect betting money into micro-investments | Phase 3 |
| **CapitalVault** | Micro-savings, micro-insurance, crowdfarming | Phase 3 |

## ⚡ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, CSS Modules
- **Design**: Apple Liquid Glass style — white/grey/turquoise, translucid gradients
- **Backend**: FastAPI, Supabase (PostgreSQL, Auth)
- **AI/ML**: Python, XGBoost, GNN (PyTorch), Bayesian ML, SHAP
- **Hosting**: Vercel

## 🏁 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
capitalizeai/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts & metadata
│   │   ├── globals.css         # Design system (tokens, glass utilities)
│   │   ├── page.tsx            # Landing page
│   │   └── page.module.css     # Landing page styles
│   └── components/
│       └── Navbar/             # Glassmorphism responsive navbar
├── public/                     # Static assets
├── package.json
└── tsconfig.json
```

## 📄 License

Proprietary — © 2026 CapitalizeAI. All rights reserved.

---

*Built with 🧠 AI × ❤️ in Douala, Cameroon*
