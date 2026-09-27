# LabhSetu — System Architecture Document

## Overview
**LabhSetu** ("Bridge to Benefits") is an AI-assisted Government Scheme Eligibility, Document Readiness & Application Guidance Platform. It operates as an informational and readiness guidance layer over fragmented central and state public benefit portals.

```text
+-----------------------------------------------------------------------+
|                              CITIZEN                                  |
|   (Web Browser: Desktop / Tablet / Mobile - Responsive & Accessible)  |
+-----------------------------------------------------------------------+
                                  │
                                  ▼
+-----------------------------------------------------------------------+
|                    FRONTEND (React + Vite + Tailwind)                 |
|  - Multi-step Adaptive Screener                                       |
|  - Scheme Discovery & Category Filtering                              |
|  - Document Upload & OCR Verification UI                              |
|  - 6-Step Application Pathway Stepper                                 |
|  - Personal Status Tracker & Receipt Logger                           |
|  - Bilingual Localization (English & Hindi via i18next)              |
|  - Admin Scheme Governance & Recharts Analytics                      |
+-----------------------------------------------------------------------+
                                  │
                         REST API / JSON
                                  │
                                  ▼
+-----------------------------------------------------------------------+
|                   BACKEND (Node.js + Express.js)                      |
|  - JWT Authentication & RBAC (Citizen, Operator, Admin, Analyst)      |
|  - Deterministic Rule Evaluator Engine (13 Operators)                 |
|  - Document Management & Privacy Masking                              |
|  - Readiness Calculator (Percentage & Missing Flagging)               |
|  - Grounded RAG Assistant Service                                     |
|  - Scheme Versioning & Comprehensive Audit Trail                      |
|  - Rate Limiting, Helmet Security Headers, Structured Errors          |
+-----------------------------------------------------------------------+
             │                                              │
             ▼                                              ▼
+-------------------------+                    +-------------------------+
|     DATA PERSISTENCE    |                    |    AI / OCR SERVICES    |
|        (MongoDB)        |                    |  (FastAPI / Python)     |
| - Users & Profiles      |                    | - OCR Extraction Engine |
| - Schemes & Rules       |                    | - Document Intelligence |
| - Documents & Metadatas |                    | - Factual Scheme RAG    |
| - Applications & Steps  |                    +-------------------------+
| - Official Sources      |
| - Audit Logs & Feedback |
+-------------------------+
             │
             ▼
+-----------------------------------------------------------------------+
|               OFFICIAL VERIFIED GOVERNMENT PORTALS                    |
|  (e.g., pmkisan.gov.in, pmayg.nic.in, beneficiary.nha.gov.in)         |
|  -> Citizens navigate directly to authentic government submission     |
+-----------------------------------------------------------------------+
```

## Core Architectural Principles
1. **Deterministic Rule Engine:** Eligibility screening uses deterministic rules based on official norms. LLMs are never allowed to override rule logic or guess eligibility status.
2. **Explainability:** Every evaluation returns matched conditions, failed conditions, and missing conditions with actionable prompts.
3. **Privacy by Design:** Identity numbers (Aadhaar, PAN) are masked in storage and presentation. Extracted OCR fields require citizen review before profile updates.
4. **Source Grounding:** AI assistance cites official sources and links directly to verified departmental portals.
