# System Architecture

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [drizzle.config.ts](file://drizzle.config.ts)
- [src/db/index.ts](file://src/db/index.ts)
- [src/db/schema.ts](file://src/db/schema.ts)
- [src/index.tsx](file://src/index.tsx)
- [src/routes/public.tsx](file://src/routes/public.tsx)
- [src/routes/admin.tsx](file://src/routes/admin.tsx)
- [src/routes/api.tsx](file://src/routes/api.tsx)
- [src/services/auth.ts](file://src/services/auth.ts)
- [src/services/junglepay.ts](file://src/services/junglepay.ts)
- [src/services/s3.ts](file://src/services/s3.ts)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts)
- [src/services/admin.ts](file://src/services/admin.ts)
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
10. [Appendices](#appendices)

## Introduction
CreatorFlix is a premium content streaming platform inspired by Netflix and OnlyFans. It follows a modern, component-driven architecture with a frontend built using Atomic Design principles and a backend powered by Hono and Bun. The system integrates a PostgreSQL database with Drizzle ORM, supports subscription-based monetization, and connects to external services for payments (JunglePay) and media storage (DigitalOcean Spaces S3-compatible). Cross-cutting concerns include authentication via JWT cookies, authorization checks, payment webhooks, and content management for white-labeled models and posts.

## Project Structure
The repository is organized into clear layers:
- Frontend (Atomic Design components and pages)
- Backend (Hono routes and services)
- Database (Drizzle ORM schema and migrations)
- Infrastructure (S3 client and configuration)
- External integrations (JunglePay payment provider)

```mermaid
graph TB
subgraph "Frontend"
UI_Public["Public Pages<br/>Home, Models, Plans, Auth, PostDetail"]
UI_Admin["Admin Pages<br/>Dashboard, Models, Ads, Plans, Finance, Settings, Whitelabel"]
UI_Components["Atomic Components<br/>Atoms, Molecules, Organisms, Templates"]
end
subgraph "Backend"
Hono["Hono App"]
Routes_Public["Public Routes"]
Routes_Admin["Admin Routes"]
Routes_API["API Routes"]
Services_Auth["AuthService"]
Services_JunglePay["JunglePayService"]
Services_Whitelabel["WhitelabelDbService"]
Services_Admin["AdminService"]
Services_S3["S3 Client"]
end
subgraph "Database"
Drizzle["Drizzle ORM"]
Schema["Schema & Relations"]
PG["PostgreSQL"]
end
subgraph "External Services"
JunglePay["JunglePay API"]
Spaces["DigitalOcean Spaces (S3)"]
end
UI_Public --> Hono
UI_Admin --> Hono
UI_Components --> UI_Public
UI_Components --> UI_Admin
Hono --> Routes_Public
Hono --> Routes_Admin
Hono --> Routes_API
Routes_Public --> Services_Whitelabel
Routes_Admin --> Services_Admin
Routes_API --> Services_Auth
Routes_API --> Services_JunglePay
Services_Whitelabel --> Drizzle
Services_Admin --> Drizzle
Services_Auth --> Drizzle
Services_JunglePay --> Drizzle
Services_S3 --> Spaces
Drizzle --> Schema
Drizzle --> PG
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- [src/services/auth.ts](file://src/services/auth.ts#L1-L91)
- [src/services/junglepay.ts](file://src/services/junglepay.ts#L1-L270)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts#L1-L24)
- [src/services/admin.ts](file://src/services/admin.ts#L1-L5)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

**Section sources**
- [README.md](file://README.md#L1-L49)
- [package.json](file://package.json#L1-L23)
- [src/index.tsx](file://src/index.tsx#L1-L21)

## Core Components
- Hono server and route mounting
- Public routes for home, models, plans, authentication, and checkout
- Admin routes for dashboard, models, ads, finance, settings, and whitelabel management
- API routes for authentication, checkout processing, payment webhooks, and admin operations
- Services for authentication, payment processing (JunglePay), whitelabel content synchronization, admin operations, and S3 signed URL generation
- Database layer with Drizzle ORM and PostgreSQL schema

Key implementation references:
- Server bootstrap and route mounting: [src/index.tsx](file://src/index.tsx#L1-L21)
- Public routes and JWT cookie verification: [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- Admin routes and whitelabel sync: [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- API routes for auth, checkout, and webhooks: [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- Authentication service: [src/services/auth.ts](file://src/services/auth.ts#L1-L91)
- JunglePay service and webhook handlers: [src/services/junglepay.ts](file://src/services/junglepay.ts#L1-L270), [src/routes/api.tsx](file://src/routes/api.tsx#L88-L170), [src/routes/api.tsx](file://src/routes/api.tsx#L401-L506)
- Whitelabel service facade: [src/services/whitelabel.ts](file://src/services/whitelabel.ts#L1-L24)
- Admin service facade: [src/services/admin.ts](file://src/services/admin.ts#L1-L5)
- S3 client and signed URL generation: [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- Database connection and schema: [src/db/index.ts](file://src/db/index.ts#L1-L8), [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

**Section sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- [src/services/auth.ts](file://src/services/auth.ts#L1-L91)
- [src/services/junglepay.ts](file://src/services/junglepay.ts#L1-L270)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts#L1-L24)
- [src/services/admin.ts](file://src/services/admin.ts#L1-L5)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

## Architecture Overview
CreatorFlix employs a layered architecture:
- Presentation Layer: Atomic Design components and pages rendered server-side via Hono
- Application Layer: Route handlers orchestrating requests, invoking services, and rendering responses
- Domain Services: Business logic for auth, payment, whitelabel sync, and admin operations
- Data Access Layer: Drizzle ORM connecting to PostgreSQL
- External Integrations: JunglePay for payments and DigitalOcean Spaces for media

```mermaid
graph TB
Client["Browser"]
Hono["Hono App"]
PublicRoutes["Public Routes"]
AdminRoutes["Admin Routes"]
APIRoutes["API Routes"]
AuthSvc["AuthService"]
JPService["JunglePayService"]
WLService["WhitelabelDbService"]
AdminSvc["AdminService"]
S3Client["S3 Client"]
DB["Drizzle ORM"]
PG["PostgreSQL"]
JP["JunglePay API"]
DO["DigitalOcean Spaces"]
Client --> Hono
Hono --> PublicRoutes
Hono --> AdminRoutes
Hono --> APIRoutes
PublicRoutes --> WLService
AdminRoutes --> AdminSvc
APIRoutes --> AuthSvc
APIRoutes --> JPService
WLService --> DB
AdminSvc --> DB
AuthSvc --> DB
JPService --> DB
JPService --> JP
S3Client --> DO
DB --> PG
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- [src/services/auth.ts](file://src/services/auth.ts#L1-L91)
- [src/services/junglepay.ts](file://src/services/junglepay.ts#L1-L270)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts#L1-L24)
- [src/services/admin.ts](file://src/services/admin.ts#L1-L5)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

## Detailed Component Analysis

### Authentication and Authorization
- JWT-based session management using cookies for authenticated routes
- Login and registration endpoints with password hashing
- Subscription status verification and enforcement
- Role-based access control (admin/user) with route-level checks

```mermaid
sequenceDiagram
participant Browser as "Browser"
participant API as "API Routes"
participant Auth as "AuthService"
participant DB as "Drizzle/PostgreSQL"
Browser->>API : POST /api/login {email,password}
API->>Auth : login(email,password)
Auth->>DB : query users by email
DB-->>Auth : user record
Auth->>Auth : verify password
Auth-->>API : user or null
API->>API : sign JWT token
API->>Browser : set auth_token cookie
API-->>Browser : redirect to home
Note over Browser,DB : Subsequent requests include auth_token cookie
```

**Diagram sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L315-L379)
- [src/services/auth.ts](file://src/services/auth.ts#L28-L39)
- [src/routes/public.tsx](file://src/routes/public.tsx#L20-L51)

**Section sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L315-L379)
- [src/services/auth.ts](file://src/services/auth.ts#L1-L91)
- [src/routes/public.tsx](file://src/routes/public.tsx#L18-L51)

### Payment Processing and Webhooks
- Internal checkout creation and pending state management
- JunglePay PIX charge creation with validation and webhook postback handling
- Dias Marketplace webhook for payment success and subscription lifecycle
- Automatic subscription activation and user status updates

```mermaid
sequenceDiagram
participant Client as "Browser"
participant API as "API Routes"
participant JP as "JunglePayService"
participant DB as "Drizzle/PostgreSQL"
participant JP_API as "JunglePay API"
Client->>API : POST /api/checkout/process {planId,paymentMethod,...}
API->>DB : insert checkouts (pending)
API-->>Client : {checkoutId}
Client->>API : POST /api/checkout/pix {customer,amount,planId,...}
API->>JP : createPixCharge(request)
JP->>DB : validate gateway & plan
JP->>JP_API : POST /transactions (PIX)
JP_API-->>JP : {id,status,pix,...}
JP->>DB : insert checkouts (pending)
JP-->>API : {pixQrCode,expirationDate,...}
API-->>Client : {pixQrCode,expirationDate,...}
JP_API-->>API : POST /api/webhook/junglepay {transaction}
API->>DB : find user by email
API->>DB : upsert subscription (active)
API->>DB : update user subscriptionStatus
API-->>JP_API : {received : true}
```

**Diagram sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L15-L86)
- [src/routes/api.tsx](file://src/routes/api.tsx#L88-L170)
- [src/routes/api.tsx](file://src/routes/api.tsx#L401-L506)
- [src/services/junglepay.ts](file://src/services/junglepay.ts#L107-L268)
- [src/db/schema.ts](file://src/db/schema.ts#L113-L127)

**Section sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L15-L86)
- [src/routes/api.tsx](file://src/routes/api.tsx#L88-L170)
- [src/routes/api.tsx](file://src/routes/api.tsx#L401-L506)
- [src/services/junglepay.ts](file://src/services/junglepay.ts#L1-L270)
- [junglepay-documentation.md](file://junglepay-documentation.md#L1-L3198)

### Whitelabel Content Management
- Synchronization of models and posts from DigitalOcean Spaces
- Thumbnail and signed URL generation for media delivery
- Paginated listing and statistics aggregation

```mermaid
flowchart TD
Start(["Admin Action"]) --> Sync["POST /admin/whitelabel/sync"]
Sync --> Fetch["WhitelabelDbService.syncModelsFromBucket()"]
Fetch --> Parse["Parser (sync/parser.ts)"]
Parse --> Persist["Persistence (sync/persistence.ts)"]
Persist --> Stats["Aggregated Stats"]
Stats --> Render["Admin UI Renders Results"]
Render --> End(["Done"])
```

**Diagram sources**
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L147-L155)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts#L1-L24)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)

**Section sources**
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L115-L155)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts#L1-L24)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)

### Database Schema and Relations
The schema defines core entities for users, plans, subscriptions, models, posts, whitelabel entities, and payment records, with explicit relations for referential integrity.

```mermaid
erDiagram
USERS {
serial id PK
text name
text email UK
text password
text role
integer subscriptionStatus
timestamp created_at
}
PLANS {
serial id PK
text name
integer price
integer duration
json benefits
text cta_text
text checkout_url
boolean accepts_pix
boolean accepts_card
}
SUBSCRIPTIONS {
serial id PK
integer user_id FK
integer plan_id FK
text external_id
timestamp start_date
timestamp end_date
text status
timestamp created_at
}
MODELS {
serial id PK
text name
text description
text icon_url
text banner_url
boolean is_featured
boolean is_advertiser
timestamp created_at
}
POSTS {
serial id PK
integer model_id FK
text title
text content_url
text type
timestamp created_at
}
CHECKOUTS {
serial id PK
integer user_id FK
integer plan_id FK
text status
text payment_method
boolean order_bump
integer total_amount
text customer_name
text customer_email
text customer_document
text customer_phone
timestamp created_at
timestamp updated_at
}
PAYMENT_GATEWAYS {
serial id PK
text name UK
text public_key
text secret_key
boolean is_active
}
ADMIN_SETTINGS {
text key PK
text value
}
WHITELABEL_MODELS {
serial id PK
text folder_name UK
text thumbnail_url
text icon_url
text banner_url
integer post_count
text status
timestamp last_synced_at
timestamp created_at
}
WHITELABEL_POSTS {
serial id PK
integer whitelabel_model_id FK
text folder_name
text title
json media_cdns
timestamp created_at
}
WHITELABEL_MEDIA {
serial id PK
integer whitelabel_post_id FK
text s3_key UK
text url
text type
timestamp created_at
}
SUPPORT_CONTACTS {
serial id PK
text platform
text url
boolean is_active
timestamp updated_at
}
USERS ||--o{ SUBSCRIPTIONS : "has one"
USERS ||--o{ CHECKOUTS : "has many"
PLANS ||--o{ SUBSCRIPTIONS : "has many"
MODELS ||--o{ POSTS : "has many"
WHITELABEL_MODELS ||--o{ WHITELABEL_POSTS : "has many"
WHITELABEL_POSTS ||--o{ WHITELABEL_MEDIA : "has many"
```

**Diagram sources**
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

**Section sources**
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

## Dependency Analysis
- Runtime and framework: Bun + Hono
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS v4
- Storage: DigitalOcean Spaces (S3-compatible)
- Payment: JunglePay (external API)
- Build and tooling: drizzle-kit, tailwindcss CLI

```mermaid
graph LR
Bun["Bun Runtime"] --> Hono["Hono Framework"]
Hono --> Routes["Routes"]
Routes --> Services["Services"]
Services --> Drizzle["Drizzle ORM"]
Drizzle --> PostgreSQL["PostgreSQL"]
Services --> S3["@aws-sdk/client-s3"]
Services --> JunglePay["JunglePay API"]
Build["Tailwind CLI"] --> Styles["static/styles.css"]
```

**Diagram sources**
- [package.json](file://package.json#L1-L23)
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)

**Section sources**
- [package.json](file://package.json#L1-L23)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)

## Performance Considerations
- Use of Bun runtime for fast startup and execution
- Drizzle ORM for efficient SQL generation and minimal overhead
- JWT cookie-based auth avoids frequent server-side sessions
- S3 signed URLs reduce origin load and improve media delivery latency
- Pagination in whitelabel APIs prevents large payloads
- Parallel operations in admin routes (e.g., stats and listing) improve responsiveness

## Troubleshooting Guide
Common areas to inspect:
- Authentication failures: verify JWT secret, cookie settings, and password hashing
- Payment webhook errors: confirm JunglePay postback URL configuration and gateway activation
- S3 signed URL issues: validate bucket name, credentials, and key normalization
- Database connectivity: check DATABASE_URL and Drizzle client initialization
- Whitelabel sync failures: review Spaces endpoint and bucket permissions

**Section sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L88-L170)
- [src/routes/api.tsx](file://src/routes/api.tsx#L401-L506)
- [src/services/s3.ts](file://src/services/s3.ts#L25-L47)
- [src/db/index.ts](file://src/db/index.ts#L5-L8)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L147-L155)

## Conclusion
CreatorFlix demonstrates a cohesive, layered architecture combining Atomic Design for the frontend, Hono for the backend, Drizzle ORM for data access, and external services for payments and storage. The system’s design emphasizes modularity, clear separation of concerns, and robust integration patterns for authentication, payment processing, and content management.

## Appendices

### Technology Stack Integration
- Runtime and framework: Bun + Hono
- Database: PostgreSQL + Drizzle ORM
- Styling: Tailwind CSS v4
- Storage: DigitalOcean Spaces (S3-compatible)
- Payment: JunglePay (external API)
- Tooling: drizzle-kit, tailwindcss CLI

**Section sources**
- [README.md](file://README.md#L5-L11)
- [package.json](file://package.json#L8-L16)

### Deployment Topology
- Single-instance deployment using Bun runtime
- Static assets served via Hono static middleware
- Environment variables for database connection and secrets
- Optional scaling via containerization and reverse proxy

**Section sources**
- [src/index.tsx](file://src/index.tsx#L16-L20)
- [src/db/index.ts](file://src/db/index.ts#L5-L8)
- [README.md](file://README.md#L13-L42)