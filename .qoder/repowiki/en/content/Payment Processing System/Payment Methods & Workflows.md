# Payment Methods & Workflows

<cite>
**Referenced Files in This Document**
- [Checkout.tsx](file://src/pages/Checkout.tsx)
- [StepIdentification.tsx](file://src/components/organisms/StepIdentification.tsx)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx)
- [StepSuccess.tsx](file://src/components/organisms/StepSuccess.tsx)
- [OrderSummary.tsx](file://src/components/organisms/OrderSummary.tsx)
- [OrderBump.tsx](file://src/components/molecules/OrderBump.tsx)
- [PlanCard.tsx](file://src/components/molecules/PlanCard.tsx)
- [Plans.tsx](file://src/pages/Plans.tsx)
- [checkout-core.js](file://static/js/checkout-core.js)
- [junglepay.ts](file://src/services/junglepay.ts)
- [api.tsx](file://src/routes/api.tsx)
- [schema.ts](file://src/db/schema.ts)
- [junglepay-documentation.md](file://junglepay-documentation.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document explains the payment method implementations and workflows in the checkout system. It covers:
- PIX payment processing via JunglePay, including QR code generation, expiration handling, and customer data sanitization
- Credit card payment flow, form validation, and security considerations
- Order bump functionality, plan selection integration, and amount calculation
- Payment flow orchestration, user experience considerations, and error recovery mechanisms
- Checkout page integration, form submission handling, and payment confirmation processes

## Project Structure
The checkout experience spans frontend pages, UI components, client-side orchestration, backend APIs, and database schemas. Key areas:
- Pages: Checkout page and plan selection
- Components: Step-by-step checkout UI and summary
- Client logic: checkout-core.js orchestrating steps, validation, and payment submission
- Backend: API routes for checkout processing and webhook handling
- Services: JunglePay service encapsulating gateway integration
- Database: Schema modeling users, plans, gateways, subscriptions, and checkouts

```mermaid
graph TB
subgraph "Frontend"
C["Checkout.tsx"]
S1["StepIdentification.tsx"]
S2["StepPayment.tsx"]
S3["StepSuccess.tsx"]
OS["OrderSummary.tsx"]
OB["OrderBump.tsx"]
CK["checkout-core.js"]
end
subgraph "Backend"
API["api.tsx"]
JP["junglepay.ts"]
end
subgraph "Persistence"
DB["schema.ts"]
end
C --> S1
C --> S2
C --> S3
C --> OS
S2 --> OB
CK --> API
API --> JP
JP --> DB
```

**Diagram sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L1-L74)
- [StepIdentification.tsx](file://src/components/organisms/StepIdentification.tsx#L1-L50)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L1-L61)
- [StepSuccess.tsx](file://src/components/organisms/StepSuccess.tsx#L1-L26)
- [OrderSummary.tsx](file://src/components/organisms/OrderSummary.tsx#L1-L62)
- [OrderBump.tsx](file://src/components/molecules/OrderBump.tsx#L1-L31)
- [checkout-core.js](file://static/js/checkout-core.js#L1-L312)
- [api.tsx](file://src/routes/api.tsx#L1-L519)
- [junglepay.ts](file://src/services/junglepay.ts#L1-L270)
- [schema.ts](file://src/db/schema.ts#L1-L178)

**Section sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L1-L74)
- [checkout-core.js](file://static/js/checkout-core.js#L1-L312)
- [api.tsx](file://src/routes/api.tsx#L1-L519)
- [junglepay.ts](file://src/services/junglepay.ts#L1-L270)
- [schema.ts](file://src/db/schema.ts#L1-L178)

## Core Components
- Checkout page: Renders the checkout layout, initializes pricing, and embeds client-side logic
- Step components: Identification, payment selection, and success confirmation
- Order summary and order bump: Dynamic pricing updates and promotional add-ons
- Client-side orchestration: Navigation, validation, masking, and payment submission
- Backend API: Processes checkout requests and handles JunglePay PIX charges
- JunglePay service: Validates gateway, sanitizes customer data, builds payloads, and persists checkout records
- Database schema: Models users, plans, gateways, subscriptions, and checkouts

**Section sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L8-L74)
- [StepIdentification.tsx](file://src/components/organisms/StepIdentification.tsx#L11-L50)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L1-L61)
- [OrderSummary.tsx](file://src/components/organisms/OrderSummary.tsx#L10-L62)
- [OrderBump.tsx](file://src/components/molecules/OrderBump.tsx#L1-L31)
- [checkout-core.js](file://static/js/checkout-core.js#L1-L312)
- [api.tsx](file://src/routes/api.tsx#L15-L86)
- [junglepay.ts](file://src/services/junglepay.ts#L52-L270)
- [schema.ts](file://src/db/schema.ts#L6-L127)

## Architecture Overview
The checkout flow integrates frontend and backend components to deliver a secure, user-friendly payment experience.

```mermaid
sequenceDiagram
participant U as "User"
participant Page as "Checkout.tsx"
participant Core as "checkout-core.js"
participant API as "api.tsx"
participant Service as "junglepay.ts"
participant DB as "schema.ts"
U->>Page : Load checkout page
Page->>Core : Initialize masks and totals
U->>Core : Enter identification and click Next
Core->>Core : Validate step 1
U->>Core : Select payment method and click Finalize
alt PIX
Core->>API : POST /api/checkout/pix
API->>Service : createPixCharge(request)
Service->>DB : Insert checkout record
Service-->>API : PIX response (qrCode, expiration)
API-->>Core : PIX result
Core->>Core : Render QR code and countdown
else Credit Card
Core->>API : POST /api/checkout/process
API->>DB : Insert checkout record
API-->>Core : Success
Core->>Page : Navigate to success step
end
```

**Diagram sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L19-L74)
- [checkout-core.js](file://static/js/checkout-core.js#L141-L208)
- [api.tsx](file://src/routes/api.tsx#L15-L86)
- [junglepay.ts](file://src/services/junglepay.ts#L107-L268)
- [schema.ts](file://src/db/schema.ts#L113-L127)

## Detailed Component Analysis

### Checkout Page Integration
- Initializes pricing from props and exposes them to client-side totals
- Embeds client-side script for checkout logic and masks
- Renders identification, payment, and success steps alongside order summary

**Section sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L8-L74)

### Step-by-Step UX Components
- Identification step: Collects email, name, CPF, and phone; validates presence before advancing
- Payment step: Presents PIX and credit card options; toggles credit card fields; renders order bump
- Success step: Confirms receipt and displays PIX QR code and copyable code when applicable

```mermaid
flowchart TD
Start(["Step 1: Identification"]) --> Validate["Validate Name, Email, CPF"]
Validate --> |Valid| Step2["Step 2: Payment Selection"]
Validate --> |Invalid| Shake["Visual feedback and prevent next"]
Step2 --> Method{"Payment Method?"}
Method --> |PIX| ProcessPix["Submit to /api/checkout/pix"]
Method --> |Credit Card| ProcessCC["Submit to /api/checkout/process"]
ProcessPix --> Success["Step 3: Success (show QR)"]
ProcessCC --> Success
```

**Diagram sources**
- [StepIdentification.tsx](file://src/components/organisms/StepIdentification.tsx#L49-L61)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L83-L96)
- [StepSuccess.tsx](file://src/components/organisms/StepSuccess.tsx#L3-L26)

**Section sources**
- [StepIdentification.tsx](file://src/components/organisms/StepIdentification.tsx#L11-L50)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L1-L61)
- [StepSuccess.tsx](file://src/components/organisms/StepSuccess.tsx#L1-L26)

### Order Bump and Amount Calculation
- Order bump is optional and toggled via a checkbox
- Client-side total updates dynamically based on base plan and bump price
- Order summary reflects bump visibility and total price

```mermaid
flowchart TD
Init["Initialize Prices (base, bump)"] --> Toggle{"Order Bump Checked?"}
Toggle --> |Yes| AddBump["Add bump price to total"]
Toggle --> |No| KeepBase["Use base price only"]
AddBump --> Display["Update total display"]
KeepBase --> Display
```

**Diagram sources**
- [checkout-core.js](file://static/js/checkout-core.js#L27-L124)
- [OrderBump.tsx](file://src/components/molecules/OrderBump.tsx#L1-L31)
- [OrderSummary.tsx](file://src/components/organisms/OrderSummary.tsx#L33-L46)

**Section sources**
- [checkout-core.js](file://static/js/checkout-core.js#L98-L124)
- [OrderBump.tsx](file://src/components/molecules/OrderBump.tsx#L1-L31)
- [OrderSummary.tsx](file://src/components/organisms/OrderSummary.tsx#L10-L62)

### Client-Side Orchestration (checkout-core.js)
- Masks: CPF and phone inputs use IMask for Brazilian formats
- Navigation: Steps validated and indicators updated
- Payment submission: Handles PIX via dedicated endpoint and credit card via legacy endpoint
- PIX rendering: Displays QR code (preferably via QRCode library, fallback to text), copyable code, and expiration date
- Error handling: Disables button during processing, shows alerts, and restores UI on failure

```mermaid
sequenceDiagram
participant UI as "UI Buttons"
participant Core as "checkout-core.js"
participant Net as "Network"
UI->>Core : processCheckout()
Core->>Core : Collect form data and compute total
alt payment_method == "pix"
Core->>Net : POST /api/checkout/pix
Net-->>Core : {success, pixQrCode, expirationDate, ...}
Core->>Core : displayPixPayment()
else payment_method == "credit_card"
Core->>Net : POST /api/checkout/process
Net-->>Core : {success}
end
Core->>UI : goToStep(3) on success
```

**Diagram sources**
- [checkout-core.js](file://static/js/checkout-core.js#L141-L208)
- [checkout-core.js](file://static/js/checkout-core.js#L211-L272)

**Section sources**
- [checkout-core.js](file://static/js/checkout-core.js#L1-L312)

### PIX Payment Workflow (JunglePay)
- Gateway verification: Ensures JunglePay is configured and active
- Validation: Checks required customer fields, amount, and plan existence
- Customer data sanitization: Removes special characters from CPF and phone
- Payload construction: Builds items array with plan and optional order bump
- API call: Submits to JunglePay transactions endpoint with Basic Auth
- Persistence: Inserts checkout record with sanitized customer data
- Response: Returns transaction ID, QR code, secure URL, expiration date, and status

```mermaid
flowchart TD
Start(["createPixCharge(request)"]) --> CheckGW["Check gateway active and keys"]
CheckGW --> |Missing| FailGW["Return INVALID_DATA/GATEWAY_*"]
CheckGW --> Validate["Validate required fields and amount"]
Validate --> |Invalid| FailVal["Return INVALID_DATA"]
Validate --> FetchPlan["Fetch plan by ID"]
FetchPlan --> BuildItems["Build items (plan [+ bump])"]
BuildItems --> Sanitize["Sanitize CPF/Phone"]
Sanitize --> CallAPI["POST /transactions to JunglePay"]
CallAPI --> RespOK{"Response OK?"}
RespOK --> |No| FailAPI["Return API_ERROR"]
RespOK --> Parse["Parse response (qrCode, expiration)"]
Parse --> Save["Insert checkout record"]
Save --> Done(["Return success with pix data"])
```

**Diagram sources**
- [junglepay.ts](file://src/services/junglepay.ts#L107-L268)

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L52-L270)

### Credit Card Payment Workflow
- Frontend: Credit card fields are shown when “credit_card” is selected
- Submission: Client sends checkout data to legacy endpoint
- Backend: Creates a pending checkout record and returns success
- Note: The current implementation delegates credit card processing to the legacy endpoint; future enhancements could integrate JunglePay for cards similarly

**Section sources**
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L40-L47)
- [checkout-core.js](file://static/js/checkout-core.js#L184-L199)
- [api.tsx](file://src/routes/api.tsx#L15-L39)

### Checkout API Endpoints
- POST /api/checkout/process: Creates a pending checkout record and returns an ID
- POST /api/checkout/pix: Validates request, calls JunglePay service, and returns PIX data
- POST /webhook/junglepay: Updates subscriptions and user status upon payment confirmation

```mermaid
sequenceDiagram
participant Core as "checkout-core.js"
participant API as "api.tsx"
participant Service as "junglepay.ts"
participant DB as "schema.ts"
Core->>API : POST /api/checkout/pix
API->>Service : createPixCharge(...)
Service->>DB : INSERT checkouts
Service-->>API : {success, pixQrCode, expirationDate, ...}
API-->>Core : PIX result
Note over Core : displayPixPayment(...) renders QR and countdown
```

**Diagram sources**
- [api.tsx](file://src/routes/api.tsx#L41-L86)
- [junglepay.ts](file://src/services/junglepay.ts#L107-L268)
- [schema.ts](file://src/db/schema.ts#L113-L127)

**Section sources**
- [api.tsx](file://src/routes/api.tsx#L15-L86)

### Webhooks and Confirmation
- JunglePay webhook: On paid status, finds user by email, selects nearest plan by price, creates/activates subscription, updates user subscription status, and marks checkout as paid
- Dias webhook: Handles Dias Marketplace payments with pending and paid transitions

**Section sources**
- [api.tsx](file://src/routes/api.tsx#L88-L170)
- [api.tsx](file://src/routes/api.tsx#L401-L506)

### Plan Selection Integration
- Plan cards link to checkout with planId query parameter
- Plans page displays plan details and subscription status for logged-in users

**Section sources**
- [PlanCard.tsx](file://src/components/molecules/PlanCard.tsx#L39-L47)
- [Plans.tsx](file://src/pages/Plans.tsx#L10-L84)

## Dependency Analysis
- Checkout.tsx depends on Step components and OrderSummary for rendering
- StepPayment depends on OrderBump and Input components
- checkout-core.js orchestrates UI steps, validation, masking, and network calls
- api.tsx routes depend on JunglePay service and database schema
- JunglePay service depends on paymentGateways and plans tables and inserts into checkouts

```mermaid
graph LR
Checkout["Checkout.tsx"] --> Step1["StepIdentification.tsx"]
Checkout --> Step2["StepPayment.tsx"]
Checkout --> Step3["StepSuccess.tsx"]
Checkout --> Summary["OrderSummary.tsx"]
Step2 --> Bump["OrderBump.tsx"]
Core["checkout-core.js"] --> API["api.tsx"]
API --> Service["junglepay.ts"]
Service --> DB["schema.ts"]
PlanPage["Plans.tsx"] --> PlanCard["PlanCard.tsx"]
PlanCard --> Checkout
```

**Diagram sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L1-L74)
- [StepIdentification.tsx](file://src/components/organisms/StepIdentification.tsx#L1-L50)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L1-L61)
- [StepSuccess.tsx](file://src/components/organisms/StepSuccess.tsx#L1-L26)
- [OrderSummary.tsx](file://src/components/organisms/OrderSummary.tsx#L1-L62)
- [OrderBump.tsx](file://src/components/molecules/OrderBump.tsx#L1-L31)
- [checkout-core.js](file://static/js/checkout-core.js#L1-L312)
- [api.tsx](file://src/routes/api.tsx#L1-L519)
- [junglepay.ts](file://src/services/junglepay.ts#L1-L270)
- [schema.ts](file://src/db/schema.ts#L1-L178)
- [Plans.tsx](file://src/pages/Plans.tsx#L1-L84)
- [PlanCard.tsx](file://src/components/molecules/PlanCard.tsx#L1-L110)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L6-L127)
- [api.tsx](file://src/routes/api.tsx#L1-L519)
- [junglepay.ts](file://src/services/junglepay.ts#L1-L270)

## Performance Considerations
- Client-side validation reduces unnecessary server calls and improves perceived responsiveness
- Masking and incremental total updates minimize layout thrashing
- Webhook-driven subscription activation avoids polling and reduces server load
- Database writes are minimal per checkout creation; ensure indexes on email and external IDs for webhook lookups

## Troubleshooting Guide
Common issues and remedies:
- Gateway misconfiguration
  - Symptom: PIX endpoint returns gateway errors
  - Action: Verify JunglePay configuration and active status in admin routes
- Invalid customer data
  - Symptom: PIX creation fails with invalid data
  - Action: Ensure CPF and phone are sanitized and required fields are present
- Network/API errors
  - Symptom: PIX creation throws API_ERROR
  - Action: Inspect response status and logs; retry after cooldown
- Webhook not activating subscription
  - Symptom: Paid status not reflected
  - Action: Confirm webhook URL is reachable and payload parsing succeeds; verify user exists and plan mapping by amount

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L107-L134)
- [api.tsx](file://src/routes/api.tsx#L88-L170)

## Conclusion
The checkout system combines modular frontend components with robust backend APIs and a gateway-integrated service to provide a seamless payment experience. PIX is fully supported with QR rendering and expiration handling, while credit card processing is available via the legacy endpoint. Order bump and dynamic pricing enhance conversion, and webhooks ensure reliable subscription activation. Future enhancements can unify payment methods behind a single gateway service and implement polling for improved reliability.