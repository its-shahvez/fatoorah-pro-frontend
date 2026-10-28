# 🛡️ SAMA-Guard AI (Saudi Financial Crime & AML Prevention Platform)

> A production-grade Enterprise AML (Anti-Money Laundering) Compliance & SAFIU Reporting prototype built specifically for Saudi financial institutions, leveraging a strict deterministic Java rule engine and real-time AI RAG streaming.

🌐 **Live Website / Demo:** [https://fatoora-pro-ksa.netlify.app/](https://fatoora-pro-ksa.netlify.app/)

---

## 🌟 Key Architecture Principle: Zero Hallucination in Scoring

In banking compliance, AI hallucinations on risk decisions are unacceptable. **SAMA-Guard AI** strictly separates concerns:
1. **Deterministic Rule Engine (Pure Java):** 100% of risk scoring, threshold checks (<50,000 SAR structuring), and velocity anomaly detection are processed natively by Java service layers.
2. **Spring AI + Gemini RAG:** Generative AI is restricted entirely to retrieving Saudi Central Bank (SAMA) AML/CTF Guide articles and streaming audit-ready Suspicious Activity Report (SAR) narratives.

---

## 🚀 Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
* **Backend (Companion Service):** Java 17+, Spring Boot 3.x, Spring AI (Gemini RAG), PostgreSQL (10-Year Statutory Retention Design)
* **Integration & Streaming:** Server-Sent Events (SSE `Flux<String>`) for typewriter streaming UI
* **Compliance Standards:** SAMA AML/CTF Guidelines, SARIE / Mada / SADAD payment rail markers, SAFIU XML Export standards

---

## ✨ Core Features Included

* **Executive Landing Page:** Clean Saudi enterprise white-theme design with an English / Arabic (RTL) toggle.
* **Interactive Rule Simulator:** Test transaction amounts against strict SAMA 50,000 SAR threshold rules instantly.
* **Live Investigation Command Center:** Alert queue with risk scores, SLAs, and countdown timers.
* **Payment Rail Evidence Table:** Detailed breakdown of underlying SARIE, Mada, and SADAD transactions preserving original Arabic merchant metadata.
* **AI SAR Narrative Stream:** Real-time simulated streaming copilot with SAMA RAG article citations.
* **SAFIU XML Export & Preview:** Generate and preview valid official STR XML compliance reports directly in the browser.
* **Immutable Audit Trail:** Track human compliance officer sign-offs (Approve/Reject) with 10-year statutory retention logs.

---

## 📦 Local Setup & Running

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/sama-aml-project.git](https://github.com/your-username/sama-aml-project.git)
