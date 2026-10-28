# 🇸🇦 Fatoorah Pro - Saudi ZATCA Phase 2 E-Invoicing System (Frontend)

**Fatoorah Pro** is a modern, enterprise-grade, bilingual (English & Arabic) web application designed for Saudi businesses to seamlessly generate, sign, and manage ZATCA Phase 2 (E-Invoicing Wave 2 Integration) compliant tax and simplified invoices.

This repository contains the **React + Vite + Tailwind CSS + Zustand** frontend, integrated with a secure Java Spring Boot backend featuring BouncyCastle ECDSA (`secp256k1`) cryptography, UBL 2.1 XML generation, SHA-256 hash-chaining, and TLV QR code generation.

---

## 🌟 Key Features

* **Bilingual Support (English & Arabic with Full RTL Toggle)**: Instant interface switching with dynamic directional layouts tailored for Saudi Arabia.
* **Dual Invoice Types**:
  * **Standard B2B Tax Invoices** (with Buyer VAT, Building No, Postal Code, and National Address).
  * **Simplified B2C Tax Invoices** (for retail and POS terminals).
* **Live ZATCA TLV QR Code Generator**: Automatically encodes Tag 1 to Tag 8 binary TLV structures (Seller Name, VAT Number, Timestamp, Total, VAT Total, XML Hash, Digital Signature, and Public Key).
* **Cryptographic Hash-Chain Ledger (PIH & ICV)**: Tracks sequential Invoice Counter Values (ICV) and links each invoice's SHA-256 hash to the previous invoice's hash (PIH) to detect any database tampering.
* **ZATCA Cryptographic Hub**:
  * Live Tamper Simulator (detects unauthorized ledger modifications).
  * CSID Onboarding & Renewal via OTP.
* **VAT Return Form-01 Report**: Automated calculation of Box 1 through Box 14 tax liabilities.
* **AI Fiscal Copilot**: Natural language assistant to parse orders, inspect liabilities, and draft compliance reports.
* **Role-Based Access Control & Team Settings**: Manage organizational profiles, branch addresses, and administrative users.

---

## 🛠️ Tech Stack

* **Framework**: React 18 + Vite (TypeScript)
* **State Management**: Zustand
* **Styling**: Tailwind CSS & Lucide Icons
* **API Integration**: RESTful service connected to Spring Boot 3.3.5 backend
* **Deployment**: Netlify (Frontend) + Render (Backend)

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18 or higher installed)
* Running Backend instance (`fatoorah-backend` on port 8080)

### Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/its-shahvez/fatoorah-pro-frontend.git](https://github.com/its-shahvez/fatoorah-pro-frontend.git)
   cd fatoorah-pro-frontend
