# LabhSetu — API Reference Specification

Base URL: `http://localhost:5000/api`

## Authentication & Profiles
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register citizen or operator | Public |
| POST | `/auth/login` | Login user, issue JWT | Public |
| GET | `/auth/me` | Fetch active user session | Bearer |
| PATCH | `/auth/preferences` | Update language preference | Bearer |
| GET | `/profile` | Get current citizen profile | Bearer |
| PUT | `/profile` | Update profile fields & recompute score | Bearer |

## Schemes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/schemes` | Search & filter schemes (pagination, query, category, state) | Public |
| GET | `/schemes/categories` | Get category breakdown & scheme counts | Public |
| GET | `/schemes/:id` | Get detailed scheme by ID with rules & sources | Public |
| POST | `/schemes/compare` | Compare up to 3 schemes | Public |

## Eligibility Engine
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/eligibility/check` | Screen profile against all published schemes | Optional |
| POST | `/eligibility/scheme/:id` | Evaluate profile against a single scheme | Optional |
| GET | `/eligibility/questions` | Get prioritized adaptive missing questions | Optional |

## Documents & OCR
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/documents/upload` | Upload document file, run OCR & extraction | Bearer |
| GET | `/documents` | List uploaded user documents | Bearer |
| GET | `/documents/:id` | Get document metadata & OCR fields | Bearer |
| PATCH | `/documents/:id/review` | Citizen accepts or edits extracted fields | Bearer |
| GET | `/documents/readiness/:schemeId` | Compute document readiness for a scheme | Bearer |
| DELETE | `/documents/:id` | Delete uploaded document | Bearer |

## Applications & Pathways
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/applications` | Start application guidance pathway | Bearer |
| GET | `/applications` | List citizen active applications | Bearer |
| GET | `/applications/:id` | Get application stepper & timeline | Bearer |
| PATCH | `/applications/:id/status` | Update progress status or reference receipt | Bearer |

## AI Assistant & Grounded RAG
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/assistant/query` | Ask assistant question, returns grounded answer & sources | Optional |
| GET | `/assistant/suggestions` | Get suggested prompt chips | Public |

## Citizen Feedback
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/feedback` | Submit feedback rating & comments | Optional |
| GET | `/feedback` | View feedback list & metrics | Admin |

## Administration & Governance
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/metrics` | Summary metrics & Recharts analytics | Admin |
| POST | `/admin/schemes` | Create and publish new scheme (v1) | Admin |
| PUT | `/admin/schemes/:id` | Update scheme & increment version | Admin |
| DELETE | `/admin/schemes/:id` | Archive / delete scheme | Admin |
| GET | `/admin/audit-logs` | Retrieve security and action audit trail | Admin |
