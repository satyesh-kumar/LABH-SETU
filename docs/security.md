# LabhSetu — Security & Privacy Architecture

## 1. Security Architecture
- **Transport Layer Security:** Enforced HTTPS in production.
- **HTTP Hardening:** Helmet middleware applies strict HTTP security headers including X-Content-Type-Options, Frameguard (Clickjacking prevention), and Content Security Policy (CSP).
- **Rate Limiting:** Express rate limiting restricts API abuse (300 requests per 15-minute window per IP).
- **Authentication:** Industry-standard JWT tokens with salted Bcrypt password hashing (10 salt rounds).
- **Role-Based Access Control (RBAC):** Strict middleware enforcement of citizen, operator, analyst, admin, and superadmin scopes.

## 2. Privacy & Data Minimization
- **Document Masking:** Aadhaar numbers are automatically masked (`XXXX-XXXX-3410`) before storage and display. PAN cards and bank account numbers are partially obscured.
- **Consent & Verification:** OCR-extracted details are never silently injected into citizen profiles; explicit citizen review and approval is required.
- **Audit Logging:** Administrative updates (scheme creation, rule alteration, role changes) are persistently recorded with actor details, timestamps, and IP addresses.
- **Sanitized Logging:** Console and server loggers strictly scrub passwords, auth tokens, and secrets.
