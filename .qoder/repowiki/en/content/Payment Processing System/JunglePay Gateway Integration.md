# JunglePay Gateway Integration

<cite>
**Referenced Files in This Document**
- [junglepay.ts](file://src/services/junglepay.ts)
- [schema.ts](file://src/db/schema.ts)
- [api.tsx](file://src/routes/api.tsx)
- [checkout-core.js](file://static/js/checkout-core.js)
- [Checkout.tsx](file://src/pages/Checkout.tsx)
- [Finance.tsx](file://src/pages/admin/Finance.tsx)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx)
- [Plans.tsx](file://src/pages/admin/Plans.tsx)
- [junglepay-documentation.md](file://junglepay-documentation.md)
- [package.json](file://package.json)
- [drizzle.config.ts](file://drizzle.config.ts)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql)
</cite>

## Update Summary
**Changes Made**
- Added payment method validation logic in JunglePay service for both PIX and credit card processing
- Enhanced backend validation to prevent processing when payment methods are disabled by plan configuration
- Updated database schema to include acceptsPix and acceptsCard flags in plans table
- Enhanced frontend checkout integration with dynamic payment method availability based on plan configuration
- Updated admin interface to manage payment method availability per plan

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Payment Methods Implementation](#payment-methods-implementation)
7. [Credit Card Payment System](#credit-card-payment-system)
8. [Frontend Integration](#frontend-integration)
9. [Webhook Processing](#webhook-processing)
10. [Payment Method Validation](#payment-method-validation)
11. [Dependency Analysis](#dependency-analysis)
12. [Performance Considerations](#performance-considerations)
13. [Troubleshooting Guide](#troubleshooting-guide)
14. [Conclusion](#conclusion)

## Introduction
This document explains the complete JunglePay gateway integration for a subscription-based platform, covering both PIX and credit card payment methods. The integration encompasses the comprehensive JunglePayService class implementation, authentication using Basic Auth, API endpoint configuration, gateway activation workflow, secret key management, credential sanitization, and the complete transaction lifecycle from initiation to completion. It documents PIX charge creation, payload construction, QR code generation, credit card tokenization, installment processing, response handling, error handling strategies, and database integration with status tracking.

**Updated** Added comprehensive payment method validation logic that prevents processing when payment methods are disabled by plan configuration, enhancing the system's flexibility and control over payment options.

## Project Structure
The integration spans backend services, database schema, frontend checkout flow, and administrative configuration screens. Key areas:
- Backend service: JunglePayService encapsulates all gateway logic including PIX and credit card payment processing with payment method validation
- API routes: Hono-based endpoints for checkout, PIX creation, credit card processing, and webhooks
- Frontend: Checkout page with dynamic payment method selection based on plan configuration and real-time payment monitoring
- Database: Drizzle ORM schema with payment gateways, plans, subscriptions, and checkouts supporting both payment methods with validation flags
- Admin: Finance page to configure JunglePay credentials and activate the gateway, plus plan management to control payment method availability

```mermaid
graph TB
subgraph "Frontend"
UI["Checkout Page<br/>Checkout.tsx"]
JS["Checkout Core<br/>checkout-core.js"]
StepPayment["Payment Selection<br/>StepPayment.tsx"]
CardFields["Card Fields & Installments<br/>StepPayment.tsx"]
QR["QR Code Generation<br/>PIX Display"]
End
subgraph "Backend"
API["API Routes<br/>api.tsx"]
SVC["JunglePay Service<br/>junglepay.ts"]
DB["Database Schema<br/>schema.ts"]
WEBHOOK["Webhook Processing<br/>Real-time Updates"]
PLAN["Plan Validation<br/>acceptsPix/acceptsCard"]
END
subgraph "External"
JUNG["JunglePay API"]
QRGEN["QR Server API"]
TOKEN["Card Tokenization<br/>JunglePagamentos.encrypt()"]
END
UI --> JS
JS --> API
API --> SVC
SVC --> PLAN
SVC --> DB
SVC --> JUNG
SVC --> TOKEN
API --> WEBHOOK
WEBHOOK --> DB
QR --> QRGEN
```

**Diagram sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L1-L107)
- [checkout-core.js](file://static/js/checkout-core.js#L1-L472)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L1-L110)
- [api.tsx](file://src/routes/api.tsx#L1-L973)
- [junglepay.ts](file://src/services/junglepay.ts#L1-L555)
- [schema.ts](file://src/db/schema.ts#L1-L253)

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L1-L555)
- [api.tsx](file://src/routes/api.tsx#L1-L973)
- [schema.ts](file://src/db/schema.ts#L1-L253)
- [checkout-core.js](file://static/js/checkout-core.js#L1-L472)
- [Checkout.tsx](file://src/pages/Checkout.tsx#L1-L107)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L1-L110)

## Core Components
- **JunglePayService**: Implements gateway activation checks, Basic Auth generation, data sanitization, plan lookup, payment method validation, PIX charge creation, credit card charge creation, payload construction, API communication, response validation, and checkout record creation for both payment methods.
- **API Routes**: Expose endpoints for processing checkout (PIX and credit card), creating charges, and receiving JunglePay webhooks with payment method validation.
- **Database Schema**: Defines paymentGateways, plans, subscriptions, and checkouts tables with appropriate relations supporting both payment methods and validation flags.
- **Frontend Checkout**: Collects customer data, handles dynamic payment method selection based on plan configuration, generates QR codes for PIX, and manages card fields for credit card payments.
- **Admin Finance**: Manages gateway activation and JunglePay secret/public keys.
- **Plan Management**: Controls payment method availability per plan through acceptsPix and acceptsCard flags.

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L90-L555)
- [api.tsx](file://src/routes/api.tsx#L41-L160)
- [schema.ts](file://src/db/schema.ts#L16-L27)
- [checkout-core.js](file://static/js/checkout-core.js#L266-L431)
- [Finance.tsx](file://src/pages/admin/Finance.tsx#L18-L111)
- [Plans.tsx](file://src/pages/admin/Plans.tsx#L80-L104)

## Architecture Overview
The system follows a layered architecture with real-time webhook processing, dual payment method support, and enhanced payment method validation:
- Presentation Layer: Checkout UI with dynamic payment method selection based on plan configuration and real-time status updates
- Application Layer: Hono routes and service logic with webhook handlers for both payment methods and payment method validation
- Domain Layer: Business logic for payment processing including PIX QR code generation, credit card tokenization, and plan-based payment method validation
- Persistence Layer: PostgreSQL via Drizzle ORM with payment method validation flags
- External Integration: JunglePay API with QR code generation and card tokenization capabilities

```mermaid
sequenceDiagram
participant User as "User"
participant UI as "Checkout UI"
participant API as "API Routes"
participant Service as "JunglePayService"
participant Plan as "Plan Validation"
participant DB as "Database"
participant JPay as "JunglePay API"
participant QRGen as "QR Server API"
participant Token as "Card Tokenization"
User->>UI : Select Payment Method (PIX or Credit Card)
UI->>API : POST /api/checkout/{method}
alt PIX Payment
API->>Service : createPixCharge(request)
Service->>Plan : validate plan.acceptsPix === true
Plan-->>Service : Payment method enabled
Service->>Service : validate request + plan lookup
Service->>Service : build payload + sanitization
Service->>JPay : POST /v1/transactions (Basic Auth)
JPay-->>Service : Transaction response (PIX data)
Service->>DB : insert checkout record (payment_method : pix)
else Credit Card Payment
API->>Service : createCardCharge(request)
Service->>Plan : validate plan.acceptsCard === true
Plan-->>Service : Payment method enabled
Service->>Service : validate request + plan lookup
Service->>Service : tokenize card + build payload
Service->>JPay : POST /v1/transactions (Basic Auth)
JPay-->>Service : Transaction response (Card data)
Service->>DB : insert checkout record (payment_method : credit_card)
end
Service-->>API : PixChargeResult or CardChargeResult
API-->>UI : Return payment method specific data
UI->>QRGen : Generate QR Code Image (if PIX)
QRGen-->>UI : QR Code Image URL
UI-->>User : Display payment instructions
```

**Diagram sources**
- [checkout-core.js](file://static/js/checkout-core.js#L266-L275)
- [api.tsx](file://src/routes/api.tsx#L41-L160)
- [junglepay.ts](file://src/services/junglepay.ts#L169-L555)
- [schema.ts](file://src/db/schema.ts#L113-L127)

## Detailed Component Analysis

### JunglePayService Implementation
Responsibilities:
- Activation and configuration checks
- Basic Auth header generation
- Data sanitization for CPF and phone
- Plan retrieval and payment method validation
- API call to JunglePay transactions endpoint
- Response validation and checkout record creation for both payment methods
- Error classification and standardized responses

Key methods and behaviors:
- **getActiveGateway()**: Queries paymentGateways table for JunglePay and verifies isActive flag and secretKey presence.
- **generateAuthHeader(secretKey)**: Creates Basic Auth header using Base64 encoding of "secretKey:x".
- **sanitizeDocument(document)**: Removes non-digit characters from CPF.
- **sanitizePhone(phone)**: Removes non-digit characters from phone.
- **getPlanById(planId)**: Retrieves plan details for payload construction and payment method validation.
- **createPixCharge(request)**: Orchestrates the entire PIX flow from validation to API call and checkout persistence with payment method validation.
- **createCardCharge(request)**: Orchestrates the entire credit card flow including tokenization, validation, and checkout persistence with payment method validation.

**Updated** Enhanced with payment method validation logic that checks plan.acceptsPix and plan.acceptsCard flags before processing payments.

Error handling:
- Gateway not configured or inactive
- Missing secret key
- Invalid customer data or amount
- Plan not found
- Payment method disabled by plan configuration
- Card tokenization failures
- API HTTP errors and unexpected responses
- Network exceptions during fetch
- Card refusal handling with specific error codes

Response handling:
- On success: Returns transactionId, payment method specific data, and status.
- On failure: Returns standardized error with code for client-side handling.

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L90-L555)

#### Class Diagram
```mermaid
classDiagram
class JunglePayService {
+getActiveGateway() Promise~Gateway~
+generateAuthHeader(secretKey) string
+sanitizeDocument(document) string
+sanitizePhone(phone) string
+getPlanById(planId) Promise~Plan~
+createPixCharge(request) Promise~PixChargeResult~
+createCardCharge(request) Promise~CardChargeResult~
}
class PixChargeRequest {
+string customerName
+string customerEmail
+string customerDocument
+string customerPhone
+number totalAmount
+number planId
+boolean orderBump
+number[] orderBumpIds
}
class CardChargeRequest {
+string customerName
+string customerEmail
+string customerDocument
+string customerPhone
+number totalAmount
+number planId
+boolean orderBump
+number[] orderBumpIds
+string cardHash
+number installments
}
class PixChargeResponse {
+boolean success
+number transactionId
+number checkoutId
+string pixQrCode
+string pixUrl
+string expirationDate
+string status
}
class CardChargeResponse {
+boolean success
+number transactionId
+number checkoutId
+string status
+string cardLastDigits
+string cardBrand
+number installments
}
class PixChargeError {
+boolean success
+string error
+string code
}
class JunglePayTransactionResponse {
+number id
+string status
+number amount
+string secureUrl
+number installments
+Pix pix
+Card card
+RefusedReason refusedReason
}
class Pix {
+string qrcode
+string expirationDate
+string end2EndId
+string receiptUrl
}
class Card {
+number id
+string brand
+string holderName
+string lastDigits
+number expirationMonth
+number expirationYear
}
class RefusedReason {
+string code
+string message
}
class Plan {
+number id
+string name
+number price
+number duration
+boolean acceptsPix
+boolean acceptsCard
}
JunglePayService --> PixChargeRequest : "consumes"
JunglePayService --> CardChargeRequest : "consumes"
JunglePayService --> PixChargeResponse : "returns on PIX success"
JunglePayService --> CardChargeResponse : "returns on card success"
JunglePayService --> PixChargeError : "returns on failure"
JunglePayService --> Plan : "validates payment methods"
PixChargeResponse --> JunglePayTransactionResponse : "constructed from"
CardChargeResponse --> JunglePayTransactionResponse : "constructed from"
JunglePayTransactionResponse --> Pix : "contains"
JunglePayTransactionResponse --> Card : "contains"
JunglePayTransactionResponse --> RefusedReason : "contains"
```

**Diagram sources**
- [junglepay.ts](file://src/services/junglepay.ts#L7-L96)
- [schema.ts](file://src/db/schema.ts#L16-L27)

### Authentication Mechanisms Using Basic Auth
- Secret key is used to construct credentials "secretKey:x"
- Base64 encoding produces the Basic scheme value
- Authorization header is sent with every transaction request to JunglePay
- Admin page allows updating secret/public keys for JunglePay

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L115-L123)
- [Finance.tsx](file://src/pages/admin/Finance.tsx#L66-L107)
- [junglepay-documentation.md](file://junglepay-documentation.md#L11-L25)

### API Endpoint Configuration
Endpoints:
- **POST /api/checkout/pix**: Validates request and delegates to JunglePayService.createPixCharge with payment method validation
- **POST /api/checkout/card**: Validates request and delegates to JunglePayService.createCardCharge with payment method validation
- **POST /api/webhook/junglepay**: Processes JunglePay webhook events and updates subscriptions and checkouts
- **POST /api/admin/finance/junglepay**: Updates JunglePay credentials
- **POST /api/admin/finance/gateway**: Activates selected gateway

Status codes:
- 400 for INVALID_DATA
- 402 for CARD_REFUSED (specific to credit card payments)
- 503 for GATEWAY_NOT_CONFIGURED and GATEWAY_INACTIVE
- 500 for API_ERROR and UNEXPECTED_RESPONSE

**Section sources**
- [api.tsx](file://src/routes/api.tsx#L43-L99)
- [api.tsx](file://src/routes/api.tsx#L101-L160)
- [api.tsx](file://src/routes/api.tsx#L162-L200)
- [api.tsx](file://src/routes/api.tsx#L222-L266)
- [api.tsx](file://src/routes/api.tsx#L222-L244)

### Gateway Activation Workflow
- Admin selects "JunglePay (Checkout Interno)" as active gateway
- Admin submits secret/public keys
- Backend updates paymentGateways table
- Frontend checkout route uses JunglePayService.createPixCharge or createCardCharge when gateway is active

```mermaid
flowchart TD
Start(["Admin opens Finance page"]) --> Select["Select Gateway"]
Select --> SubmitKeys["Submit JunglePay Keys"]
SubmitKeys --> UpdateDB["Update paymentGateways"]
UpdateDB --> Active{"Gateway Active?"}
Active --> |Yes| Checkout["Checkout uses JunglePayService"]
Active --> |No| Inactive["Show Gateway Not Active"]
Checkout --> MethodSelection["Dynamic Payment Method Selection"]
MethodSelection --> PIX["PIX Payment Path (if enabled)"]
MethodSelection --> Card["Credit Card Payment Path (if enabled)"]
```

**Diagram sources**
- [Finance.tsx](file://src/pages/admin/Finance.tsx#L36-L60)
- [api.tsx](file://src/routes/api.tsx#L222-L244)
- [junglepay.ts](file://src/services/junglepay.ts#L105-L113)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L28-L46)

**Section sources**
- [Finance.tsx](file://src/pages/admin/Finance.tsx#L18-L111)
- [api.tsx](file://src/routes/api.tsx#L222-L244)
- [junglepay.ts](file://src/services/junglepay.ts#L105-L113)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L28-L46)

### Secret Key Management and Credential Sanitization
- Secret key stored in paymentGateways.secretKey
- Public key optional for internal checkout flows
- Credentials sanitized before API requests:
  - CPF: digits only
  - Phone: digits only
- Admin page exposes password-protected input for secret key

**Section sources**
- [schema.ts](file://src/db/schema.ts#L29-L36)
- [junglepay.ts](file://src/services/junglepay.ts#L125-L137)
- [Finance.tsx](file://src/pages/admin/Finance.tsx#L90-L99)

## Payment Methods Implementation

### Dual Payment Method Support
The system now supports both PIX and credit card payment methods through a unified JunglePayService with enhanced validation:

**Payment Method Types**:
- **PIX**: Instant payment with QR code generation (enabled/disabled per plan)
- **Credit Card**: Tokenized card payments with installment options (enabled/disabled per plan)

**Shared Processing Flow**:
- Gateway validation and configuration checks
- Customer data sanitization
- Plan lookup and payment method validation
- Payment method specific payload construction
- API communication and response validation
- Checkout record creation with payment method tracking

**Updated** Payment method validation occurs before any processing begins, preventing attempts to process payments when a plan has disabled that payment method.

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L90-L555)
- [schema.ts](file://src/db/schema.ts#L16-L27)

### PIX Payment Implementation

#### PIX Charge Creation Process
The PIX payment implementation follows a comprehensive workflow with payment method validation:

**Payment Method Validation**:
- Validates plan.acceptsPix === true before processing
- Returns INVALID_DATA error if payment method is disabled

**Payload Construction**:
- paymentMethod: pix
- amount: totalAmount in cents
- customer: name, email, sanitized phone, document with type cpf
- items: plan item and optional order bump item
- pix: expiresInDays: 1
- postbackUrl: constructed from BASE_URL environment variable

**API Call Details**:
- Method: POST to https://api.junglepagamentos.com/v1/transactions
- Headers: Content-Type: application/json, Authorization: Basic <Base64(secretKey:x)>
- Response validation requires pix.qrcode presence

**Database Integration**:
- Checkout record inserted with payment_method: pix
- Customer information sanitized and stored
- Transaction ID stored for webhook correlation

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L169-L352)
- [junglepay.ts](file://src/services/junglepay.ts#L225-L232)
- [junglepay.ts](file://src/services/junglepay.ts#L234-L283)

#### Response Handling and Error Management
PIX response handling includes:
- Success case: Returns transactionId, pix QR code, secure URL, expiration date, and status
- Error cases: Standardized error codes with appropriate HTTP status mapping
- Validation: Ensures pix.qrcode presence in API response
- Payment method validation: Returns INVALID_DATA when plan.acceptsPix is false

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L285-L352)
- [junglepay.ts](file://src/services/junglepay.ts#L289-L294)
- [junglepay.ts](file://src/services/junglepay.ts#L308-L316)

### Credit Card Payment Implementation

#### Credit Card Charge Creation Process
The credit card payment implementation includes advanced tokenization, installment processing, and payment method validation:

**Payment Method Validation**:
- Validates plan.acceptsCard === true before processing
- Returns INVALID_DATA error if payment method is disabled

**Card Tokenization**:
- Uses JunglePagamentos.encrypt() for secure card data tokenization
- Frontend collects card details and generates hash via SDK
- Tokenized card data passed securely to backend

**Installment Options**:
- Supports 1x to 12x installments
- Dynamic installment calculation based on plan price
- Installment count passed to JunglePay API

**Payload Construction**:
- paymentMethod: credit_card
- amount: totalAmount in cents
- installments: request.installments || 1
- card: { hash: request.cardHash }
- customer: sanitized customer data
- items: plan item and optional order bump item
- postbackUrl: constructed from BASE_URL environment variable

**API Call Details**:
- Method: POST to https://api.junglepagamentos.com/v1/transactions
- Headers: Content-Type: application/json, Authorization: Basic <Base64(secretKey:x)>
- Response validation includes card data and status

**Database Integration**:
- Checkout record inserted with payment_method: credit_card
- Customer information sanitized and stored
- Transaction ID stored for webhook correlation
- Card brand and last digits stored for display

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L357-L555)
- [junglepay.ts](file://src/services/junglepay.ts#L421-L428)
- [junglepay.ts](file://src/services/junglepay.ts#L430-L480)

#### Card Tokenization Workflow
The card tokenization process involves secure frontend processing:

**Frontend Tokenization**:
- JunglePagamentos SDK loaded from JunglePay CDN
- Card details collected via masked input fields
- Tokenization performed using JunglePagamentos.encrypt()
- Hash validated before submission

**Backend Processing**:
- Tokenized card hash validated and processed
- Installment count validated (1-12)
- Payment processed through JunglePay API
- Response handled with card-specific data

**Section sources**
- [checkout-core.js](file://static/js/checkout-core.js#L313-L327)
- [checkout-core.js](file://static/js/checkout-core.js#L330-L341)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L48-L68)

#### Response Handling and Error Management
Credit card response handling includes:
- Success case: Returns transactionId, status, card brand, last digits, and installments
- Error cases: Standardized error codes including CARD_REFUSED
- Card refusal handling with specific error messages
- Validation: Ensures card data presence in API response
- Payment method validation: Returns INVALID_DATA when plan.acceptsCard is false

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L508-L555)
- [junglepay.ts](file://src/services/junglepay.ts#L484-L506)
- [junglepay.ts](file://src/services/junglepay.ts#L519-L532)

## Frontend Integration

### Dynamic Payment Method Checkout
The frontend checkout page provides comprehensive dual payment method experience with dynamic availability:

**Payment Method Selection**:
- Radio button selection between PIX and Credit Card based on plan configuration
- Dynamic form field visibility based on selection
- Real-time payment method switching
- Graceful handling when no payment methods are available

**Initialization**:
- Loads JunglePay SDK for card tokenization
- Sets up masked input fields for CPF and phone
- Initializes checkout state with pricing information
- Generates installment options for credit card payments
- Respects plan.acceptsPix and plan.acceptsCard flags

**Payment Flow**:
- Customer fills identification and contact information
- Selects payment method (PIX or Credit Card) based on availability
- For PIX: Calls /api/checkout/pix endpoint with sanitized data
- For Credit Card: Tokenizes card via SDK, then calls /api/checkout/card
- Receives payment method specific data with status information
- Generates QR code image using external QR server API (for PIX)
- Handles gracefully when payment methods are disabled

**Section sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L21-L53)
- [checkout-core.js](file://static/js/checkout-core.js#L31-L43)
- [checkout-core.js](file://static/js/checkout-core.js#L308-L350)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L12-L18)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L45-L74)

### JavaScript Payment Processing
The checkout-core.js handles the complete dual payment processing with payment method validation:

**State Management**:
- Tracks current step in checkout process
- Manages pricing calculations with optional order bump
- Stores JunglePay public key for SDK initialization
- Handles payment method switching logic based on plan configuration

**Event Handling**:
- Form validation for required fields
- Payment method toggle between PIX and credit card based on availability
- Order bump selection with dynamic pricing
- Installment selection for credit card payments

**Payment Processing**:
- For PIX: Calls /api/checkout/pix endpoint with sanitized data
- For Credit Card: Calls JunglePagamentos.encrypt() for tokenization, then /api/checkout/card
- Handles successful payment responses with appropriate UI updates
- Provides error handling for failed payment creation
- Gracefully handles cases when payment methods are disabled

**Section sources**
- [checkout-core.js](file://static/js/checkout-core.js#L21-L43)
- [checkout-core.js](file://static/js/checkout-core.js#L186-L252)
- [checkout-core.js](file://static/js/checkout-core.js#L308-L350)
- [checkout-core.js](file://static/js/checkout-core.js#L352-L390)

### Installment Calculation
The frontend calculates and displays installment options dynamically:

**Installment Generation**:
- Generates 1x to 12x installment options
- Calculates monthly payment amount based on plan price
- Formats currency display with comma decimal separator
- Sets default to 1x installment

**UI Integration**:
- Dropdown select element for installment selection
- Real-time display of installment details
- Automatic recalculation when plan price changes

**Section sources**
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L13-L18)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L56-L67)

## Webhook Processing

### Real-Time Transaction Updates
The webhook system provides real-time transaction status updates for both payment methods:

**Webhook Endpoint**:
- POST /api/webhook/junglepay processes JunglePay events
- Handles transaction status updates for both PIX and credit card payments
- Supports paid and waiting_payment states for all payment methods

**Processing Logic**:
- Validates webhook payload type (must be transaction)
- Extracts customer, status, amount, and payment method from payload
- Creates/activates subscriptions for paid transactions
- Updates user subscription status to active
- Marks checkout records as paid based on payment method

**State Management**:
- Paid status: Creates subscription, activates user, updates checkout
- Waiting payment: Logs transaction status for monitoring
- Unsupported status: Ignores and logs for debugging

**Section sources**
- [api.tsx](file://src/routes/api.tsx#L162-L200)
- [api.tsx](file://src/routes/api.tsx#L179-L202)

### Database Integration
Webhook processing integrates with the database for both payment methods:

**Subscription Creation**:
- Calculates start and end dates based on plan duration
- Creates subscription record with external transaction ID
- Sets subscription status to active immediately for paid transactions

**User Status Updates**:
- Updates user subscriptionStatus to 1 (active)
- Links subscription to user account
- Maintains audit trail with timestamps

**Checkout Updates**:
- Updates checkout records to paid status based on payment method
- Links checkout to user and plan information
- Provides correlation between checkout and transaction
- Handles both pix and credit_card payment methods

**Section sources**
- [api.tsx](file://src/routes/api.tsx#L179-L202)
- [schema.ts](file://src/db/schema.ts#L38-L47)

## Payment Method Validation

### Plan-Based Payment Method Control
The system now includes comprehensive payment method validation at the plan level:

**Database Schema Changes**:
- plans table includes acceptsPix boolean flag (default: true)
- plans table includes acceptsCard boolean flag (default: true)
- Both flags can be controlled independently per plan

**Validation Logic**:
- PIX validation: plan.acceptsPix === true
- Credit Card validation: plan.acceptsCard === true
- Validation occurs before any payment processing begins
- Returns INVALID_DATA error with specific message when payment method is disabled

**Admin Interface**:
- Admin Plans page allows enabling/disabling payment methods per plan
- Checkbox controls for acceptsPix and acceptsCard flags
- Real-time updates to plan configuration
- Immediate effect on frontend checkout availability

**Frontend Integration**:
- Checkout page receives plan.acceptsPix and plan.acceptsCard flags
- Payment method radio buttons only appear when enabled
- Graceful handling when no payment methods are available
- Clear messaging when payment methods are disabled

**Section sources**
- [schema.ts](file://src/db/schema.ts#L16-L27)
- [junglepay.ts](file://src/services/junglepay.ts#L225-L232)
- [junglepay.ts](file://src/services/junglepay.ts#L421-L428)
- [Plans.tsx](file://src/pages/admin/Plans.tsx#L80-L104)
- [Checkout.tsx](file://src/pages/Checkout.tsx#L62-L69)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L45-L74)

### Payment Method Availability Flow
The payment method availability system follows this flow:

```mermaid
flowchart TD
Start(["User selects plan"]) --> LoadPlan["Load plan with acceptsPix/acceptsCard"]
LoadPlan --> CheckPIX{"plan.acceptsPix === true?"}
CheckPIX --> |Yes| ShowPIX["Show PIX payment option"]
CheckPIX --> |No| HidePIX["Hide PIX payment option"]
LoadPlan --> CheckCard{"plan.acceptsCard === true?"}
CheckCard --> |Yes| ShowCard["Show Credit Card payment option"]
CheckCard --> |No| HideCard["Hide Credit Card payment option"]
ShowPIX --> ProcessPIX["Process PIX payment"]
ShowCard --> ProcessCard["Process Credit Card payment"]
HidePIX --> CheckBoth{"Both disabled?"}
HideCard --> CheckBoth
CheckBoth --> |Yes| NoMethods["Display 'No payment methods available' message"]
CheckBoth --> |No| Continue["Proceed with available methods"]
```

**Diagram sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L62-L69)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L45-L74)
- [junglepay.ts](file://src/services/junglepay.ts#L225-L232)
- [junglepay.ts](file://src/services/junglepay.ts#L421-L428)

**Section sources**
- [Checkout.tsx](file://src/pages/Checkout.tsx#L62-L69)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L45-L74)
- [junglepay.ts](file://src/services/junglepay.ts#L225-L232)
- [junglepay.ts](file://src/services/junglepay.ts#L421-L428)

## Dependency Analysis
- JunglePayService depends on:
  - Database access via Drizzle ORM
  - Environment variables for BASE_URL
  - Fetch API for external calls
  - QR server API for QR code generation
  - JunglePagamentos SDK for card tokenization
  - Plan validation logic for payment method control
- API routes depend on:
  - JunglePayService for business logic
  - Database for CRUD operations
  - Webhook processing for real-time updates
  - Payment method validation for plan control
- Frontend depends on:
  - API routes for checkout and webhook handling
  - Admin routes for configuration
  - QR server API for payment visualization
  - JunglePagamentos SDK for card tokenization
  - Plan configuration for payment method availability

```mermaid
graph LR
CheckoutJS["checkout-core.js"] --> API["api.tsx"]
API --> Service["junglepay.ts"]
Service --> DB["schema.ts"]
Service --> Plan["Plan Validation"]
Service --> Env["Environment Variables"]
Service --> QRServer["QR Server API"]
Service --> TokenSDK["JunglePagamentos SDK"]
API --> DB
AdminUI["Finance.tsx"] --> API
AdminUI --> Plans["Plans.tsx"]
Webhook["Webhook Handler"] --> DB
StepPayment["StepPayment.tsx"] --> API
StepPayment --> TokenSDK
```

**Diagram sources**
- [checkout-core.js](file://static/js/checkout-core.js#L404-L405)
- [api.tsx](file://src/routes/api.tsx#L1-L973)
- [junglepay.ts](file://src/services/junglepay.ts#L1-L555)
- [schema.ts](file://src/db/schema.ts#L1-L253)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L1-L110)
- [Plans.tsx](file://src/pages/admin/Plans.tsx#L80-L104)

**Section sources**
- [package.json](file://package.json#L8-L22)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L1-L18)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L1-L11)

## Performance Considerations
- Minimize network round-trips by batching validations and database writes
- Use connection pooling for database operations
- Cache frequently accessed plan data if needed
- Implement retry/backoff for transient API failures
- Keep payload minimal and only include required fields
- Optimize QR code generation caching for repeated displays
- Implement efficient webhook processing with proper error handling
- Cache JunglePay public key for card tokenization
- Use installment calculation caching for performance
- **Updated** Add caching for plan payment method validation results to reduce database queries

## Troubleshooting Guide
Common issues and resolutions:
- **Gateway not configured or inactive**:
  - Verify paymentGateways row for JunglePay and isActive flag
  - Ensure secretKey is present
- **Invalid data errors**:
  - Confirm customerName, customerEmail, customerDocument, totalAmount, planId are provided and valid
  - For credit card: ensure cardHash and installments are provided
- **Payment method disabled errors**:
  - **Updated** Check plan.acceptsPix or plan.acceptsCard flags in database
  - Verify plan configuration in admin interface
  - Ensure payment method is enabled for the selected plan
- **API communication failures**:
  - Check network connectivity and BASE_URL environment variable
  - Review Basic Auth header construction
- **Unexpected responses**:
  - Validate pix.qrcode presence in PIX response
  - Validate card data presence in credit card response
- **Webhook not activating subscription**:
  - Ensure webhook endpoint is reachable and correctly parses payloads
  - Verify user exists and plan amount matches
- **QR code generation failures**:
  - Check QR server API availability
  - Verify pix QR code URL construction
- **Frontend checkout issues**:
  - Ensure JunglePay SDK loads correctly
  - Verify public key configuration
  - Check browser console for JavaScript errors
  - **Updated** Verify plan.acceptsPix and plan.acceptsCard flags are correct
- **Credit card tokenization failures**:
  - Verify JunglePagamentos SDK is loaded
  - Check card field validation and formatting
  - Ensure cardHash is properly generated and passed
- **Installment calculation errors**:
  - Verify plan price is correctly calculated
  - Check installment option generation logic
  - Ensure installment count is within 1-12 range

**Section sources**
- [junglepay.ts](file://src/services/junglepay.ts#L169-L195)
- [junglepay.ts](file://src/services/junglepay.ts#L357-L383)
- [junglepay.ts](file://src/services/junglepay.ts#L225-L232)
- [junglepay.ts](file://src/services/junglepay.ts#L421-L428)
- [junglepay.ts](file://src/services/junglepay.ts#L253-L261)
- [junglepay.ts](file://src/services/junglepay.ts#L430-L438)
- [junglepay.ts](file://src/services/junglepay.ts#L508-L517)
- [api.tsx](file://src/routes/api.tsx#L162-L200)
- [checkout-core.js](file://static/js/checkout-core.js#L404-L405)
- [checkout-core.js](file://static/js/checkout-core.js#L313-L327)
- [Checkout.tsx](file://src/pages/Checkout.tsx#L62-L69)
- [StepPayment.tsx](file://src/components/organisms/StepPayment.tsx#L69-L73)

## Conclusion
The JunglePay integration provides a robust, secure, and auditable payment flow supporting both PIX and credit card transactions with comprehensive real-time processing capabilities and enhanced payment method validation. By centralizing validation, sanitization, and API communication in JunglePayService, leveraging webhook-driven state updates, implementing frontend QR code generation for PIX, providing secure card tokenization for credit card payments, and adding plan-based payment method control, the system ensures reliable transaction lifecycle management with clear error handling, admin-controlled configuration, and flexible payment method availability. The complete implementation supports both internal checkout flows and external payment processing, providing flexibility for different deployment scenarios while maintaining security and compliance standards. The addition of payment method validation logic significantly enhances the platform's ability to control payment options per plan, providing granular control over payment processing capabilities while maintaining the same high standards of security and reliability.