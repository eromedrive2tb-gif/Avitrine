# Technology Stack

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [README.md](file://README.md)
- [tsconfig.json](file://tsconfig.json)
- [tailwind.config.js](file://tailwind.config.js)
- [drizzle.config.ts](file://drizzle.config.ts)
- [bun.lock](file://bun.lock)
- [src/index.tsx](file://src/index.tsx)
- [src/db/index.ts](file://src/db/index.ts)
- [src/db/schema.ts](file://src/db/schema.ts)
- [src/routes/public.tsx](file://src/routes/public.tsx)
- [src/routes/admin.tsx](file://src/routes/admin.tsx)
- [src/routes/api.tsx](file://src/routes/api.tsx)
- [src/services/s3.ts](file://src/services/s3.ts)
- [src/utils/storage.ts](file://src/utils/storage.ts)
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
CreatorFlix is a premium content streaming platform built with modern web technologies. The platform leverages a cohesive stack designed for rapid development, strong typing, efficient rendering, and scalable infrastructure. This document explains the complete technology stack, including the Bun runtime, Hono framework, PostgreSQL with Drizzle ORM, Tailwind CSS v4, and DigitalOcean Spaces S3-compatible storage. It also covers rationale, roles, version requirements, dependencies, build configuration, and development setup.

## Project Structure
The project follows a clear separation of concerns:
- Runtime and server: Bun with Hono
- Frontend: React JSX with Hono JSX renderer
- Styling: Tailwind CSS v4
- Database: PostgreSQL with Drizzle ORM
- Storage: DigitalOcean Spaces (S3-compatible)
- Build and scripts: Bun scripts and Tailwind CLI

```mermaid
graph TB
subgraph "Runtime & Server"
Bun["Bun Runtime"]
Hono["Hono Framework"]
end
subgraph "Frontend"
React["React JSX"]
HonoJSX["Hono JSX Renderer"]
Tailwind["Tailwind CSS v4"]
end
subgraph "Data Layer"
Drizzle["Drizzle ORM"]
Postgres["PostgreSQL"]
end
subgraph "Storage"
S3["@aws-sdk/client-s3"]
Spaces["DigitalOcean Spaces (S3-compatible)"]
end
Bun --> Hono
Hono --> HonoJSX
HonoJSX --> React
React --> Tailwind
Hono --> Drizzle
Drizzle --> Postgres
Hono --> S3
S3 --> Spaces
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/utils/storage.ts](file://src/utils/storage.ts#L1-L39)

**Section sources**
- [README.md](file://README.md#L1-L49)
- [package.json](file://package.json#L1-L23)
- [tsconfig.json](file://tsconfig.json#L1-L13)

## Core Components
- Bun runtime: Provides fast startup, hot reload, and native TypeScript support. Used for development and production serving.
- Hono framework: Minimalist web framework for Bun with excellent performance and JSX support.
- PostgreSQL + Drizzle ORM: Modern SQL toolkit with type-safe queries and migrations.
- Tailwind CSS v4: Utility-first CSS framework for rapid UI development.
- DigitalOcean Spaces (S3): Object storage for media assets with S3-compatible APIs.

**Section sources**
- [README.md](file://README.md#L5-L11)
- [package.json](file://package.json#L8-L16)
- [src/index.tsx](file://src/index.tsx#L1-L21)

## Architecture Overview
The system is structured around three layers:
- Presentation layer: Hono routes render React components via Hono JSX and Tailwind CSS v4.
- Application layer: Route handlers orchestrate business logic, authentication, and integrations.
- Data and storage layers: Drizzle ORM manages PostgreSQL schemas and migrations; AWS SDK integrates with DigitalOcean Spaces.

```mermaid
graph TB
Client["Browser"]
HonoApp["Hono App"]
PublicRoutes["Public Routes (/)"]
AdminRoutes["Admin Routes (/admin)"]
ApiRoutes["API Routes (/api)"]
ReactComponents["React Components"]
Tailwind["Tailwind CSS v4"]
DrizzleORM["Drizzle ORM"]
PostgresDB["PostgreSQL"]
AWSSDK["@aws-sdk/client-s3"]
Spaces["DigitalOcean Spaces"]
Client --> HonoApp
HonoApp --> PublicRoutes
HonoApp --> AdminRoutes
HonoApp --> ApiRoutes
PublicRoutes --> ReactComponents
AdminRoutes --> ReactComponents
ApiRoutes --> ReactComponents
ReactComponents --> Tailwind
PublicRoutes --> DrizzleORM
AdminRoutes --> DrizzleORM
ApiRoutes --> DrizzleORM
DrizzleORM --> PostgresDB
ApiRoutes --> AWSSDK
AWSSDK --> Spaces
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)

## Detailed Component Analysis

### Bun Runtime and Hono Framework
- Bun runtime powers the development server with hot module replacement and fast iteration cycles.
- Hono provides routing, middleware, cookies, JWT, and JSX rendering capabilities.
- The server exports a Bun-compatible handler with a static asset route and mounted route groups.

```mermaid
sequenceDiagram
participant Client as "Browser"
participant Hono as "Hono App"
participant Static as "serveStatic"
participant Public as "publicRoutes"
participant Admin as "adminRoutes"
participant API as "apiRoutes"
Client->>Hono : HTTP Request
Hono->>Static : Serve static assets
Hono->>Public : Route match "/"
Public-->>Client : HTML response (React via Hono JSX)
Hono->>Admin : Route match "/admin/*"
Admin-->>Client : HTML response (React via Hono JSX)
Hono->>API : Route match "/api/*"
API-->>Client : JSON/XML response
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)

**Section sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [package.json](file://package.json#L3-L7)

### Database Layer: PostgreSQL with Drizzle ORM
- Drizzle ORM connects to PostgreSQL using a typed schema and supports migrations.
- The configuration defines the schema path, migration output, dialect, and connection URL.
- The schema models users, plans, subscriptions, payment gateways, whitelabel entities, and support contacts.

```mermaid
erDiagram
USERS {
serial id PK
text name
text email UK
text password
text role
integer subscription_status
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
PAYMENT_GATEWAYS {
serial id PK
text name UK
text public_key
text secret_key
boolean is_active
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
USERS ||--o{ SUBSCRIPTIONS : "has"
USERS ||--o{ CHECKOUTS : "creates"
PLANS ||--o{ SUBSCRIPTIONS : "defines"
MODELS ||--o{ POSTS : "contains"
WHITELABEL_MODELS ||--o{ WHITELABEL_POSTS : "contains"
WHITELABEL_POSTS ||--o{ WHITELABEL_MEDIA : "contains"
CHECKOUTS }o--|| PAYMENT_GATEWAYS : "processed_by"
```

**Diagram sources**
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

**Section sources**
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

### Styling: Tailwind CSS v4
- Tailwind CSS v4 is configured with custom color palette, typography, gradients, box-shadows, animations, and plugins.
- Content paths include all TS/TSX files under src for purging unused styles.
- Build scripts compile Tailwind CSS into static styles.

```mermaid
flowchart TD
Start(["Build CSS"]) --> Input["input.css"]
Input --> TailwindCLI["Tailwind CLI"]
TailwindCLI --> Output["static/styles.css"]
Output --> Browser["Browser Load"]
```

**Diagram sources**
- [package.json](file://package.json#L5-L6)
- [tailwind.config.js](file://tailwind.config.js#L1-L39)

**Section sources**
- [tailwind.config.js](file://tailwind.config.js#L1-L39)
- [package.json](file://package.json#L5-L6)

### Storage: DigitalOcean Spaces S3 Integration
- The platform uses the AWS SDK for S3-compatible storage via DigitalOcean Spaces.
- Two modules handle storage operations:
  - Signing S3 keys for temporary access to private content.
  - Uploading files to Spaces and returning public URLs.

```mermaid
sequenceDiagram
participant Client as "Client"
participant API as "apiRoutes"
participant S3Sign as "signS3Key"
participant Spaces as "DigitalOcean Spaces"
Client->>API : GET /api/models/ : modelName/posts
API->>S3Sign : Sign S3 key for media
S3Sign->>Spaces : GetObjectCommand
Spaces-->>S3Sign : Signed URL
S3Sign-->>API : Signed URL
API-->>Client : JSON with signed URLs
```

**Diagram sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L295-L313)
- [src/services/s3.ts](file://src/services/s3.ts#L25-L47)

**Section sources**
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/utils/storage.ts](file://src/utils/storage.ts#L1-L39)

### Authentication and Authorization Flow
- JWT tokens are used for session management with cookies.
- Login and registration endpoints create and set auth tokens.
- Protected routes verify JWT and load user data from the database.

```mermaid
sequenceDiagram
participant Client as "Browser"
participant API as "apiRoutes"
participant Auth as "AuthService"
participant DB as "Drizzle ORM"
Client->>API : POST /api/login
API->>Auth : Authenticate credentials
Auth->>DB : Verify user
DB-->>Auth : User record
Auth-->>API : User validated
API->>API : sign(JWT payload)
API-->>Client : Set auth_token cookie
Client->>Public : GET /
Public->>Public : verify(JWT cookie)
Public->>DB : Load user with subscription
DB-->>Public : User + subscription
Public-->>Client : Rendered page
```

**Diagram sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L316-L379)
- [src/routes/public.tsx](file://src/routes/public.tsx#L20-L51)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)

**Section sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L13-L399)
- [src/routes/public.tsx](file://src/routes/public.tsx#L18-L51)

## Dependency Analysis
The project relies on a focused set of dependencies:
- Bun runtime and Hono for server-side rendering and routing
- Drizzle ORM and PostgreSQL for data persistence
- Tailwind CSS v4 for styling
- AWS SDK for S3-compatible storage
- Additional build-time tools for CSS processing

```mermaid
graph LR
Bun["Bun Runtime"]
Hono["Hono"]
Drizzle["Drizzle ORM"]
Postgres["PostgreSQL"]
Tailwind["Tailwind CSS v4"]
AWS["AWS SDK for S3"]
Spaces["DigitalOcean Spaces"]
Bun --> Hono
Hono --> Drizzle
Drizzle --> Postgres
Hono --> Tailwind
Hono --> AWS
AWS --> Spaces
```

**Diagram sources**
- [package.json](file://package.json#L8-L16)
- [bun.lock](file://bun.lock#L1-L23)

**Section sources**
- [package.json](file://package.json#L8-L22)
- [bun.lock](file://bun.lock#L1-L23)

## Performance Considerations
- Bun’s native TypeScript support and hot reload reduce iteration time during development.
- Hono’s minimal footprint and efficient routing keep latency low for API and SSR endpoints.
- Drizzle ORM’s type-safe queries and migrations help prevent runtime errors and optimize database operations.
- Tailwind CSS v4 compiles efficiently with preconfigured content paths to minimize bundle size.
- S3 integration uses signed URLs for secure, time-limited access to media assets.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common setup and runtime issues:
- Database connectivity: Ensure DATABASE_URL is configured and reachable. Confirm Drizzle connection and schema initialization.
- JWT secrets: Set JWT_SECRET for token signing and verification.
- Tailwind build: Run the CSS build script to generate static styles.
- S3 credentials: Verify DigitalOcean Spaces endpoint, region, and credentials for uploads and signed URLs.

**Section sources**
- [README.md](file://README.md#L13-L42)
- [src/db/index.ts](file://src/db/index.ts#L5-L7)
- [src/routes/api.tsx](file://src/routes/api.tsx#L13-L399)
- [src/utils/storage.ts](file://src/utils/storage.ts#L3-L16)

## Conclusion
CreatorFlix’s technology stack combines Bun, Hono, PostgreSQL with Drizzle ORM, Tailwind CSS v4, and DigitalOcean Spaces to deliver a fast, maintainable, and scalable platform. The choices emphasize developer productivity, type safety, and modern web practices while leveraging proven tools for performance and reliability.