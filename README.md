# LabhSetu (लाभसेतु) — Bridge to Benefits

> **AI-assisted Government Scheme Eligibility, Document Readiness & Application Guidance Platform**  
> *Tagline:* Bridge to Benefits — Discover. Check. Prepare. Apply.

---

## 🏛️ Executive Summary

Government benefits and public welfare schemes are frequently distributed across fragmented central ministries, state departments, and disparate portals. Citizens struggle to determine:
- Which welfare schemes genuinely apply to their household
- Which eligibility conditions they satisfy vs. which they fail
- Which documents are mandatory and whether they are ready
- What the authentic official application pathway looks like
- How to track submitted application receipts

**LabhSetu** establishes a guided public-service digital layer over these fragmented sources. It empowers citizens to understand preliminary eligibility via a **deterministic rule evaluator**, test **document readiness via OCR intelligence**, and follow **official application pathways** while maintaining source citations and user privacy.

---

## ✨ Core Features & Highlights

1. **Deterministic Eligibility Engine:**
   - 13 distinct comparison operators (`EQUALS`, `LESS_THAN_OR_EQUAL`, `GREATER_THAN_OR_EQUAL`, `IN`, `BOOLEAN_TRUE`, etc.).
   - Transparent result explanation: *Why Matched*, *Conditions Not Met*, *Information Still Required*.
   - Never makes probabilistic blackbox decisions.

2. **Document Readiness & OCR Intelligence:**
   - Supports Aadhaar, PAN, Income Certificate, Domicile Certificate, Ration Card, Bank Passbook.
   - Extracts structured demographic fields with confidence scores.
   - **Privacy-Preserving:** Automatic document number masking (`XXXX-XXXX-3410`).
   - Citizen review flow (*Accept* / *Edit*) with optional profile synchronization.

3. **6-Step Application Guidance Pathway:**
   - Stepper: *Review Conditions → Prepare Documents → Official Portal Navigation → Application Form → Submission → Timeline Tracking*.
   - Direct redirection to verified official departmental URLs.
   - Personal timeline tracker with official reference receipt logging.

4. **Source-Grounded AI Assistant (RAG):**
   - Grounded strictly in verified government scheme guidelines.
   - Live source citations with verified departmental links and explicit disclaimers.

5. **Bilingual Localization (English & Hindi):**
   - Seamless one-click language toggle across navigation, screeners, badges, and guidance.

6. **Administration & Scheme Governance:**
   - Scheme creation, publishing, and automated scheme versioning (`v1`, `v2`, `v3`).
   - Interactive Recharts analytics: Schemes by Category, Applications by Status.
   - Security and governance audit trail logging.

---

## 🏗️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, i18next, react-router-dom, Axios.
- **Backend:** Node.js, Express.js, MongoDB / Mongoose, `mongodb-memory-server` (automatic zero-config fallback), JWT Authentication, Bcrypt.js, Multer, Helmet, CORS, Rate Limiting.
- **AI Microservice:** Python 3, FastAPI, Uvicorn, Pydantic (integrated with Node backend fallback).
- **Design Standard:** Modern Indian Government Public Digital Service platform (WCAG 2.1 AA accessible, Government Blue palette, Inter typography).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on v22.x)
- npm v9+

### 1. Installation
Clone the repository and install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Run Database Seed
The server automatically seeds demo schemes on first boot if the database is empty. You can also seed manually:
```bash
cd server
npm run seed
```

### 3. Run Backend Server
```bash
cd server
npm start
```
*Backend runs on `http://localhost:5000` (API base: `http://localhost:5000/api`)*

### 4. Run Frontend Client
In a new terminal window:
```bash
cd client
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🧪 Testing

Run automated unit and integration tests:

```bash
# In server/
cd server

# Run deterministic eligibility engine unit tests (10 test cases)
npx jest tests/eligibilityEngine.test.js

# Run API endpoint integration tests with Supertest (5 test cases)
npx jest tests/api.test.js
```

Validate frontend production build:
```bash
cd client
npm run build
```

---

## 👤 Instant Demo Accounts

For rapid evaluation, the login page features **One-Click Demo Login** buttons:

| Role | Email | Password | Pre-populated Profile |
|---|---|---|---|
| **Citizen** | `citizen@labhsetu.gov.in` | `password123` | Rameshwar Sharma (Small Farmer, UP, ₹1.8L income) |
| **Administrator** | `admin@labhsetu.gov.in` | `password123` | Priya Sundaram (Director of Digital Services) |
| **Operator** | `operator@labhsetu.gov.in` | `password123` | Amit Verma (CSC District Operator) |

---

## 📋 Complete Citizen Demo Flow

1. Open `http://localhost:5173`.
2. Click **Find Schemes** to browse Central/State schemes with category & state filters.
3. Click **Check Eligibility** and complete the 4-step adaptive questionnaire.
4. View the **Preliminary Match Results** with transparent reasons (*Why Matched*, *Missing Info*).
5. Open **PM Kisan Samman Nidhi (PM-KISAN)** and examine requirements.
6. Navigate to **Documents** → Upload an Aadhaar or Income Certificate.
7. Inspect the **OCR extraction card**; verify the masked number, click **Accept & Save**.
8. View the updated **Document Readiness Score (100%)**.
9. Click **Start Application Pathway** → Proceed through the 6-step guidance stepper.
10. Click **Open Official Portal** to see authentic government portal linkage (`pmkisan.gov.in`).
11. Log your receipt number in the **Application Tracker** timeline.
12. Ask the **AI Assistant** questions in English or Hindi and observe source citations.
13. Sign in as **Admin** to view Recharts analytics, audit trail, and scheme versioning.

---

## 🛡️ License & Public Notice
*LabhSetu is an informational assistance platform. Final eligibility and benefit disbursement rest strictly with the concerned government authority.*
