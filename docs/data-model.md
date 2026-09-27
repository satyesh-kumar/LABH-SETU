# LabhSetu — Database & Data Model Specification

## Collections Overview
The platform utilizes MongoDB for scalable document storage and relationship modeling:

```text
users              ──< profiles
schemes            ──< eligibilityRules
                   ──< requirements
                   ──< officialSources
                   ──< schemeVersions
applications       ──> schemes
                   ──> users
documents          ──> users
feedback           ──> users
auditLogs          ──> users
```

### 1. `users`
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (bcrypt hash)
- `role`: Enum ('citizen', 'operator', 'admin', 'analyst', 'superadmin')
- `preferredLanguage`: Enum ('en', 'hi')
- `isDemo`: Boolean

### 2. `profiles`
- `userId`: Ref -> User
- `fullName`: String
- `dateOfBirth`: Date / `age`: Number
- `gender`: Enum ('male', 'female', 'other')
- `maritalStatus`: Enum ('single', 'married', 'widowed', 'divorced')
- `state`: String
- `district`: String
- `residenceType`: Enum ('rural', 'urban', 'semi-urban')
- `annualIncome`: Number
- `occupation`: String
- `socialCategory`: Enum ('general', 'obc', 'sc', 'st', 'ews')
- `isFarmer`: Boolean
- `isBPL`: Boolean
- `disabilityStatus`: Boolean
- `completionScore`: Number (0 - 100%)

### 3. `schemes`
- `name`: String / `nameHi`: String
- `slug`: String (unique)
- `department`: String / `ministry`: String
- `category`: String
- `benefitType`: String
- `benefitSummary`: String / `benefitSummaryHi`: String
- `stateScope`: String ('All India' or specific state)
- `eligibilityRules`: Array -> Ref EligibilityRule
- `requirements`: Array -> Ref Requirement
- `officialSources`: Array -> Ref OfficialSource
- `applicationSteps`: Array of step objects
- `version`: Number
- `status`: Enum ('published', 'draft', 'archived')
- `isDemo`: Boolean

### 4. `eligibilityRules`
- `schemeId`: Ref -> Scheme
- `field`: String (e.g. 'annualIncome', 'isFarmer', 'age')
- `operator`: Enum (13 supported operators)
- `value`: Mixed
- `isMandatory`: Boolean
- `missingInfoPrompt`: String / `missingInfoPromptHi`: String

### 5. `documents`
- `userId`: Ref -> User
- `documentType`: String ('aadhaar', 'income_certificate', 'pan', etc.)
- `storageKey`: String
- `fileUrl`: String
- `ocrStatus`: Enum ('pending', 'processing', 'processed', 'needs_review', 'verified')
- `extractedFields`: Object (name, DOB, documentNumber, maskedNumber, income, address)
- `userVerifiedFields`: Boolean
