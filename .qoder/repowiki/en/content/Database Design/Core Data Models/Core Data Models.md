# Core Data Models

<cite>
**Referenced Files in This Document**
- [schema.ts](file://src/db/schema.ts)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql)
- [0001_chunky_thunderbolts.sql](file://drizzle/0001_chunky_thunderbolts.sql)
- [0002_sparkling_madripoor.sql](file://drizzle/0002_sparkling_madripoor.sql)
- [0003_deep_thunderbird.sql](file://drizzle/0003_deep_thunderbird.sql)
- [0004_mixed_vermin.sql](file://drizzle/0004_mixed_vermin.sql)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql)
- [0010_ads_table.sql](file://drizzle/0010_ads_table.sql)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql)
- [ads.ts](file://src/services/ads.ts)
- [Ads.tsx](file://src/pages/admin/Ads.tsx)
- [AdsCreate.tsx](file://src/pages/admin/AdsCreate.tsx)
- [api.tsx](file://src/routes/api.tsx)
- [AdBanner.tsx](file://src/components/molecules/AdBanner.tsx)
- [models.ts](file://src/services/whitelabel/queries/models.ts)
- [posts.ts](file://src/services/whitelabel/queries/posts.ts)
- [mappers.ts](file://src/services/admin/mappers.ts)
- [Plans.tsx](file://src/pages/Plans.tsx)
- [Models.tsx](file://src/pages/Models.tsx)
- [AdminPlans.tsx](file://src/pages/admin/Plans.tsx)
</cite>

## Update Summary
**Changes Made**
- Added comprehensive Ads data model with enhanced analytics tracking capabilities
- Introduced separate Impressions and Clicks data models with detailed metadata fields
- Enhanced Ads model with comprehensive analytics tracking including user agent and IP tracking
- Added placement-based targeting system with type-specific validation
- Integrated automated impression tracking through IntersectionObserver
- Implemented comprehensive admin interface for ad campaign management

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
This document describes CreatorFlix's core data models: users, subscriptions, plans, models, posts, and the newly enhanced Ads system with comprehensive analytics tracking. It explains field definitions, data types, constraints, validation rules, primary and foreign keys, indexing strategies, and business rules. It also outlines common query patterns and provides sample data structures to help developers and operators implement and maintain the system effectively.

## Project Structure
The data model is defined in a single schema file and enforced by a set of migrations. The Ads system includes dedicated service layer with comprehensive analytics tracking, admin interface for campaign management, and client-side integration for automatic impression tracking. Queries for whitelabel models and posts are implemented in dedicated service modules. Frontend pages consume these models to render user-facing views.

```mermaid
graph TB
subgraph "Schema"
U["users"]
P["plans"]
S["subscriptions"]
M["models"]
Po["posts"]
WLM["whitelabel_models"]
WLP["whitelabel_posts"]
WLMed["whitelabel_media"]
PG["payment_gateways"]
CK["checkouts"]
AS["admin_settings"]
SC["support_contacts"]
AD["ads"]
IMP["impressions"]
CLK["clicks"]
end
U --> S
P -. "referenced by" .-> S
M --> Po
WLM --> WLP
WLP --> WLMed
U -. "referenced by" .-> CK
P -. "referenced by" .-> CK
AD --> IMP
AD --> CLK
```

**Diagram sources**
- [schema.ts](file://src/db/schema.ts#L6-L253)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L1-L253)

## Core Components

### Users
- Purpose: Stores user account information and subscription status.
- Fields and constraints:
  - id: serial, primary key
  - name: text
  - email: text, not null, unique
  - password: text, not null
  - role: text enum ['admin','user'], default 'user'
  - subscriptionStatus: integer, default 0
  - createdAt: timestamp, default now()
- Validation rules:
  - Email uniqueness enforced at DB level.
  - Password presence enforced at DB level.
  - Role constrained to predefined enum.
- Indexing strategy:
  - Primary key index on id.
  - Unique index on email via unique constraint.
- Business rules:
  - subscriptionStatus is an integer flag; frontend logic interprets 1 as "has active subscription" and displays subscription details accordingly.
- Sample data structure:
  - { id: 1, name: "Alex", email: "alex@example.com", password: "...", role: "user", subscriptionStatus: 1, createdAt: "2025-01-01T00:00:00Z" }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L6-L14)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L35-L43)
- [0003_deep_thunderbird.sql](file://drizzle/0003_deep_thunderbird.sql#L1-L1)
- [Plans.tsx](file://src/pages/Plans.tsx#L11-L16)

### Subscriptions
- Purpose: Tracks user subscriptions to plans, including status and timing.
- Fields and constraints:
  - id: serial, primary key
  - userId: integer, not null, references users(id)
  - planId: integer, references plans(id)
  - externalId: text (payment gateway transaction id)
  - startDate: timestamp (nullable)
  - endDate: timestamp (nullable)
  - status: text enum ['active','expired','pending'], default 'pending'
  - createdAt: timestamp, default now()
- Validation rules:
  - userId must reference an existing user.
  - planId must reference an existing plan.
  - Status constrained to predefined enum.
- Indexing strategy:
  - Primary key index on id.
  - Foreign key indices implied by references.
- Business rules:
  - Status transitions and lifecycle are managed by backend/payment flows; frontend displays subscription details when subscriptionStatus indicates an active subscription.
- Sample data structure:
  - { id: 1, userId: 1, planId: 2, externalId: "ext_abc123", startDate: "2025-01-01T00:00:00Z", endDate: "2025-01-31T00:00:00Z", status: "active", createdAt: "2025-01-01T00:00:00Z" }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L37-L46)
- [0001_chunky_thunderbolts.sql](file://drizzle/0001_chunky_thunderbolts.sql#L1-L14)
- [0004_mixed_vermin.sql](file://drizzle/0004_mixed_vermin.sql#L9-L11)

### Plans
- Purpose: Defines subscription tiers and checkout configuration.
- Fields and constraints:
  - id: serial, primary key
  - name: text, not null
  - price: integer, not null (in cents)
  - duration: integer, not null (in days)
  - benefits: json (stored as JSON)
  - ctaText: text
  - checkoutUrl: text
  - acceptsPix: boolean, default true
  - acceptsCard: boolean, default true
- Validation rules:
  - price and duration are required positive integers.
  - checkoutUrl optional; depends on selected gateway.
  - acceptsPix and acceptsCard flags enable/disable payment methods.
- Indexing strategy:
  - Primary key index on id.
- Business rules:
  - Duration determines billing cycle length.
  - Benefits stored as JSON for flexibility.
- Sample data structure:
  - { id: 1, name: "Monthly VIP", price: 19900, duration: 30, benefits: { features: ["unlimited_access"] }, ctaText: "Subscribe Now", checkoutUrl: "https://...", acceptsPix: true, acceptsCard: true }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L16-L27)
- [0002_sparkling_madripoor.sql](file://drizzle/0002_sparkling_madripoor.sql#L1-L1)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L10-L11)
- [AdminPlans.tsx](file://src/pages/admin/Plans.tsx#L5-L13)

### Models
- Purpose: Core content creators' profiles and metadata.
- Fields and constraints:
  - id: serial, primary key
  - name: text, not null
  - description: text
  - iconUrl: text
  - bannerUrl: text
  - isFeatured: boolean, default false
  - isAdvertiser: boolean, default false
  - createdAt: timestamp, default now()
- Validation rules:
  - Name is required.
  - Flags control visibility and advertising status.
- Indexing strategy:
  - Primary key index on id.
- Business rules:
  - isFeatured and isAdvertiser influence discovery and monetization.
- Sample data structure:
  - { id: 1, name: "Creator One", description: "Popular model", iconUrl: "https://...", bannerUrl: "https://...", isFeatured: true, isAdvertiser: false, createdAt: "2025-01-01T00:00:00Z" }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L48-L57)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L6-L15)

### Posts
- Purpose: Individual content items associated with a model.
- Fields and constraints:
  - id: serial, primary key
  - modelId: integer, references models(id)
  - title: text
  - contentUrl: text, not null
  - type: text enum ['image','video'], not null
  - createdAt: timestamp, default now()
- Validation rules:
  - contentUrl required; type constrained to enum.
  - Optional association to a model via modelId.
- Indexing strategy:
  - Primary key index on id; foreign key index implied by references.
- Business rules:
  - Content type affects rendering and player behavior.
- Sample data structure:
  - { id: 1, modelId: 1, title: "Beach Day", contentUrl: "https://...", type: "image", createdAt: "2025-01-01T00:00:00Z" }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L59-L66)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L26-L33)

### Ads System (Enhanced)
- Purpose: Comprehensive advertising system with detailed analytics tracking and placement targeting.
- Fields and constraints:
  - id: serial, primary key
  - name: text, not null (campaign name)
  - type: text enum ['diamond','diamond_block','banner','spot','hero'], default 'banner'
  - placement: text enum with specific locations, default 'home_top'
  - status: text enum ['active','paused','draft'], default 'draft'
  - title: text, not null
  - subtitle: text (banner-specific)
  - ctaText: text (call-to-action)
  - imageUrl: text (ad image URL)
  - link: text, not null (destination URL)
  - category: text (hero carousel category)
  - impressions: integer, default 0 (denormalized counter)
  - clicks: integer, default 0 (denormalized counter)
  - priority: integer, default 0 (higher = higher priority)
  - startDate: timestamp (campaign start date)
  - endDate: timestamp (campaign end date)
  - createdAt: timestamp, default now()
  - updatedAt: timestamp, default now() (auto-updated)
- Validation rules:
  - Type-specific placement validation ensures ads appear only in valid locations.
  - Status constrained to predefined enum.
  - Denormalized counters automatically maintained.
- Indexing strategy:
  - Primary key index on id.
  - Composite indexes recommended for status/placement/type queries.
- Business rules:
  - Type determines valid placement locations and rendering behavior.
  - Priority controls ad display order within placements.
  - Campaign dates determine ad availability.
  - Automatic impression tracking with metadata collection.
- Sample data structure:
  - { id: 1, name: "Summer Sale 2026", type: "banner", placement: "home_top", status: "active", title: "Summer Collection", subtitle: "Up to 50% off", ctaText: "SHOP NOW", imageUrl: "https://...", link: "https://...", category: "SUMMER", impressions: 1250, clicks: 45, priority: 10, startDate: "2026-06-01T00:00:00Z", endDate: "2026-06-30T23:59:59Z", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L196-L235)
- [0010_ads_table.sql](file://drizzle/0010_ads_table.sql#L1-L21)
- [ads.ts](file://src/services/ads.ts#L58-L77)

### Impressions Tracking
- Purpose: Detailed analytics tracking for ad impressions with metadata collection.
- Fields and constraints:
  - id: serial, primary key
  - adId: integer, not null, references ads(id) with cascade delete
  - placement: text (location where impression occurred)
  - userAgent: text (browser/user agent information)
  - ip: text (client IP address)
  - createdAt: timestamp, default now()
- Validation rules:
  - adId must reference an existing ad.
  - Metadata fields capture contextual information.
- Indexing strategy:
  - Primary key index on id.
  - Foreign key index on adId for fast joins.
- Business rules:
  - Automatically created when ad impressions are tracked.
  - Supports manual and automatic tracking scenarios.
  - Metadata enables detailed analytics and fraud detection.
- Sample data structure:
  - { id: 1, adId: 1, placement: "home_top", userAgent: "Mozilla/5.0...", ip: "203.0.113.10", createdAt: "2026-05-01T10:30:00Z" }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L237-L244)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L1-L8)
- [ads.ts](file://src/services/ads.ts#L246-L266)

### Clicks Tracking
- Purpose: Detailed analytics tracking for ad clicks with metadata collection.
- Fields and constraints:
  - id: serial, primary key
  - adId: integer, not null, references ads(id) with cascade delete
  - placement: text (location where click occurred)
  - userAgent: text (browser/user agent information)
  - ip: text (client IP address)
  - createdAt: timestamp, default now()
- Validation rules:
  - adId must reference an existing ad.
  - Metadata fields capture contextual information.
- Indexing strategy:
  - Primary key index on id.
  - Foreign key index on adId for fast joins.
- Business rules:
  - Automatically created when ad clicks are tracked.
  - Supports manual and automatic tracking scenarios.
  - Metadata enables detailed analytics and fraud detection.
- Sample data structure:
  - { id: 1, adId: 1, placement: "home_top", userAgent: "Mozilla/5.0...", ip: "203.0.113.10", createdAt: "2026-05-01T10:32:15Z" }

**Section sources**
- [schema.ts](file://src/db/schema.ts#L246-L253)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L10-L17)
- [ads.ts](file://src/services/ads.ts#L271-L290)

### Additional Entities (Supporting Models)
These entities support advanced features and administration.

- Payment Gateways
  - Fields: id, name (unique), publicKey, secretKey, postbackUrl, isActive
  - Constraints: unique(name)
  - Business rules: Gateway selection influences checkout behavior.

- Checkouts
  - Fields: id, userId (optional), planId, externalId, status, paymentMethod, orderBump, orderBumpIds, totalAmount (cents), customer_* fields, timestamps
  - Constraints: status enum; totalAmount not null; planId not null
  - Business rules: Captures payment intent and customer info; supports optional user linkage.

- Admin Settings
  - Fields: key (pk), value
  - Business rules: Centralized key-value store for admin configuration.

- Support Contacts
  - Fields: id, platform, url, isActive, updatedAt
  - Business rules: Dynamic support links per platform.

- Whitelabel Models
  - Fields: id, folderName (unique), thumbnail/icon/banner URLs, postCount, status enum, lastSyncedAt, createdAt
  - Constraints: unique(folderName); status enum

- Whitelabel Posts
  - Fields: id, whitelabelModelId (fk), folderName, title, mediaCdns (JSON), createdAt
  - Constraints: unique(whitelabelModelId, folderName)

- Whitelabel Media
  - Fields: id, whitelabelPostId (fk), s3Key (unique), url, type enum, createdAt
  - Constraints: unique(s3Key); type enum

**Section sources**
- [schema.ts](file://src/db/schema.ts#L29-L127)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L1-L76)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L1-L8)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L1-L18)

## Architecture Overview
The data model centers around users subscribing to plans, managing content via models and posts, supporting advertising campaigns with comprehensive analytics tracking, and supporting administrative and monetization features. Whitelabel entities mirror core entities for external integrations.

```mermaid
erDiagram
USERS {
int id PK
text name
text email UK
text password
text role
int subscription_status
timestamp created_at
}
PLANS {
int id PK
text name
int price
int duration
json benefits
text cta_text
text checkout_url
boolean accepts_pix
boolean accepts_card
}
SUBSCRIPTIONS {
int id PK
int user_id FK
int plan_id FK
text external_id
timestamp start_date
timestamp end_date
text status
timestamp created_at
}
MODELS {
int id PK
text name
text description
text icon_url
text banner_url
boolean is_featured
boolean is_advertiser
timestamp created_at
}
POSTS {
int id PK
int model_id FK
text title
text content_url
text type
timestamp created_at
}
ADS {
int id PK
text name
text type
text placement
text status
text title
text subtitle
text cta_text
text image_url
text link
text category
int impressions
int clicks
int priority
timestamp start_date
timestamp end_date
timestamp created_at
timestamp updated_at
}
IMPRESSIONS {
int id PK
int ad_id FK
text placement
text user_agent
text ip
timestamp created_at
}
CLICKS {
int id PK
int ad_id FK
text placement
text user_agent
text ip
timestamp created_at
}
CHECKOUTS {
int id PK
int user_id FK
int plan_id FK
text external_id
text status
text payment_method
boolean order_bump
json order_bump_ids
int total_amount
text customer_name
text customer_email
text customer_document
text customer_phone
timestamp created_at
timestamp updated_at
}
PAYMENT_GATEWAYS {
int id PK
text name UK
text public_key
text secret_key
text postback_url
boolean is_active
}
ADMIN_SETTINGS {
text key PK
text value
}
SUPPORT_CONTACTS {
int id PK
text platform
text url
boolean is_active
timestamp updated_at
}
WHITELABEL_MODELS {
int id PK
text folder_name UK
text thumbnail_url
text icon_url
text banner_url
int post_count
text status
timestamp last_synced_at
timestamp created_at
}
WHITELABEL_POSTS {
int id PK
int whitelabel_model_id FK
text folder_name
text title
json media_cdns
timestamp created_at
}
WHITELABEL_MEDIA {
int id PK
int whitelabel_post_id FK
text s3_key UK
text url
text type
timestamp created_at
}
USERS ||--o{ SUBSCRIPTIONS : "has"
PLANS ||--o{ SUBSCRIPTIONS : "subscribed_by"
MODELS ||--o{ POSTS : "contains"
ADS ||--o{ IMPRESSIONS : "tracked_by"
ADS ||--o{ CLICKS : "tracked_by"
WHITELABEL_MODELS ||--o{ WHITELABEL_POSTS : "contains"
WHITELABEL_POSTS ||--o{ WHITELABEL_MEDIA : "has"
USERS ||--o{ CHECKOUTS : "creates"
PLANS ||--o{ CHECKOUTS : "purchased_in"
```

**Diagram sources**
- [schema.ts](file://src/db/schema.ts#L6-L253)

## Detailed Component Analysis

### Users and Subscription Status Tracking
- Business rule: subscriptionStatus is an integer flag interpreted by the frontend. When equal to 1, the UI displays subscription details and plan information.
- Frontend usage: The subscription page conditionally renders based on user.subscriptionStatus and the presence of a subscription record with plan details.

```mermaid
flowchart TD
Start(["User loads subscription page"]) --> CheckFlag["Check user.subscriptionStatus == 1"]
CheckFlag --> |Yes| LoadSub["Load subscription and plan details"]
LoadSub --> Render["Render subscription summary"]
CheckFlag --> |No| ShowPlans["Show plans page"]
Render --> End(["Done"])
ShowPlans --> End
```

**Diagram sources**
- [Plans.tsx](file://src/pages/Plans.tsx#L11-L61)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L12-L12)
- [Plans.tsx](file://src/pages/Plans.tsx#L11-L16)

### Plans and Payment Methods
- Business rule: Plans define pricing (in cents), duration (days), and accepted payment methods (PIX/credit card). Admin UI adapts based on the active gateway.
- Frontend usage: AdminPlans page renders three plan cards (weekly/monthly/annual) and toggles fields depending on the active gateway.

```mermaid
flowchart TD
A["Admin opens Plans page"] --> B["Load plans by duration"]
B --> C{"Active gateway?"}
C --> |Dias Marketplace| D["Show checkoutUrl field"]
C --> |JunglePay| E["Show acceptsPix/acceptsCard checkboxes"]
D --> F["Save changes"]
E --> F
F --> G["Persist updates"]
```

**Diagram sources**
- [AdminPlans.tsx](file://src/pages/admin/Plans.tsx#L20-L126)
- [schema.ts](file://src/db/schema.ts#L16-L27)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L10-L11)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L16-L27)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L1-L11)
- [AdminPlans.tsx](file://src/pages/admin/Plans.tsx#L20-L126)

### Models and Posts Management
- Business rule: Models represent creators; Posts are content items linked to a model. Type determines rendering behavior.
- Frontend usage: Models page lists whitelabel models and renders cards; posts are fetched per model for display.

```mermaid
sequenceDiagram
participant UI as "Models Page"
participant Q as "WhitelabelModelQueries"
participant DB as "Database"
UI->>Q : list(page, limit)
Q->>DB : SELECT models ORDER BY createdAt DESC
DB-->>Q : rows + total
Q-->>UI : { data, total, page, limit, totalPages }
```

**Diagram sources**
- [Models.tsx](file://src/pages/Models.tsx#L16-L56)
- [models.ts](file://src/services/whitelabel/queries/models.ts#L36-L57)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L48-L66)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L6-L33)
- [models.ts](file://src/services/whitelabel/queries/models.ts#L36-L57)
- [Models.tsx](file://src/pages/Models.tsx#L16-L56)

### Ads System and Analytics Tracking
- Business rule: Ads system provides comprehensive advertising capabilities with detailed analytics tracking. Type-specific placement validation ensures ads appear only in appropriate locations. Automatic impression tracking captures user metadata for analytics and fraud prevention.
- Frontend usage: Admin interface allows creation and management of ad campaigns with real-time preview and analytics tracking.

```mermaid
sequenceDiagram
participant UI as "Ad Preview"
participant JS as "IntersectionObserver"
participant API as "API Routes"
participant Service as "AdsService"
participant DB as "Database"
UI->>JS : Observe ad element
JS->>API : POST /api/ads/ : id/impression
API->>Service : trackImpression()
Service->>DB : Update ads.impressions + 1
Service->>DB : Insert into impressions table
DB-->>Service : Success
Service-->>API : Success
API-->>JS : 200 OK
JS-->>UI : Hide observer
```

**Diagram sources**
- [AdBanner.tsx](file://src/components/molecules/AdBanner.tsx#L39-L53)
- [api.tsx](file://src/routes/api.tsx#L921-L940)
- [ads.ts](file://src/services/ads.ts#L246-L266)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L196-L253)
- [ads.ts](file://src/services/ads.ts#L86-L380)
- [Ads.tsx](file://src/pages/admin/Ads.tsx#L1-L131)
- [AdsCreate.tsx](file://src/pages/admin/AdsCreate.tsx#L1-L569)

### Whitelabel Content Pipeline
- Business rule: Whitelabel models and posts mirror core entities for external content ingestion. Media entries are signed for secure delivery.
- Mapping: Admin mappers transform whitelabel staging data into production-ready records.

```mermaid
sequenceDiagram
participant WL as "WhitelabelModelQueries"
participant DB as "Database"
participant S3 as "S3 Signer"
WL->>DB : SELECT whitelabel_models
DB-->>WL : rows
WL->>DB : JOIN whitelabel_posts/media
DB-->>WL : thumbnails
WL->>S3 : sign s3Key for thumbnails
S3-->>WL : signed URL
WL-->>WL : enrich models with signed thumbnails
```

**Diagram sources**
- [models.ts](file://src/services/whitelabel/queries/models.ts#L7-L34)
- [mappers.ts](file://src/services/admin/mappers.ts#L4-L38)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L73-L103)
- [models.ts](file://src/services/whitelabel/queries/models.ts#L7-L34)
- [mappers.ts](file://src/services/admin/mappers.ts#L4-L38)

### Whitelabel Posts and Media
- Business rule: Posts aggregate media assets; media entries are signed for secure access. The UI constructs image/video arrays and selects a thumbnail.
- Query pattern: Fetch posts by modelId with pagination and sign media URLs.

```mermaid
sequenceDiagram
participant WL as "WhitelabelPostQueries"
participant DB as "Database"
participant S3 as "S3 Signer"
WL->>DB : SELECT whitelabel_posts WHERE modelId
DB-->>WL : posts
loop For each post
WL->>S3 : sign media images
S3-->>WL : signed images
WL->>S3 : sign media videos
S3-->>WL : signed videos
end
WL-->>WL : build { thumbnail, mediaCdns }
```

**Diagram sources**
- [posts.ts](file://src/services/whitelabel/queries/posts.ts#L7-L35)
- [schema.ts](file://src/db/schema.ts#L85-L103)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L85-L103)
- [posts.ts](file://src/services/whitelabel/queries/posts.ts#L7-L35)

## Dependency Analysis
- Primary keys: users.id, plans.id, subscriptions.id, models.id, posts.id, whitelabel_models.id, whitelabel_posts.id, whitelabel_media.id, payment_gateways.id, checkouts.id, admin_settings.key, support_contacts.id, ads.id, impressions.id, clicks.id.
- Foreign keys:
  - subscriptions.userId -> users.id
  - subscriptions.planId -> plans.id
  - posts.modelId -> models.id
  - whitelabel_posts.whitelabelModelId -> whitelabel_models.id (ON DELETE CASCADE)
  - whitelabel_media.whitelabelPostId -> whitelabel_posts.id (ON DELETE CASCADE)
  - checkouts.userId -> users.id
  - checkouts.planId -> plans.id
  - impressions.adId -> ads.id (ON DELETE CASCADE)
  - clicks.adId -> ads.id (ON DELETE CASCADE)
- Uniqueness:
  - users.email
  - whitelabel_models.folderName
  - whitelabel_posts.whitelabelModelId,folderName
  - whitelabel_media.s3Key
  - payment_gateways.name
  - admin_settings.key
  - ads.name

```mermaid
graph LR
U["users.id"] --> S["subscriptions.user_id"]
P["plans.id"] --> S["subscriptions.plan_id"]
M["models.id"] --> Po["posts.model_id"]
WLM["whitelabel_models.id"] --> WLP["whitelabel_posts.whitelabel_model_id"]
WLP --> WLMed["whitelabel_media.whitelabel_post_id"]
U --> CK["checkouts.user_id"]
P --> CK["checkouts.plan_id"]
AD["ads.id"] --> IMP["impressions.ad_id"]
AD --> CLK["clicks.ad_id"]
```

**Diagram sources**
- [schema.ts](file://src/db/schema.ts#L37-L253)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L78-L79)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L17-L18)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L19-L20)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L37-L253)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L78-L79)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L17-L18)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L19-L20)

## Performance Considerations
- Indexes:
  - Primary keys are indexed by default.
  - Unique constraints imply unique indexes (users.email, whitelabel_models.folderName, whitelabel_media.s3Key, payment_gateways.name).
  - Consider adding composite indexes for frequent joins and filters (e.g., subscriptions(userId,status), posts(modelId,createdAt), ads(status,placement,priority), impressions(adId,createdAt), clicks(adId,createdAt)).
- Query patterns:
  - Paginated reads for whitelabel models and posts reduce memory footprint.
  - DISTINCT ON and JOINs for thumbnail enrichment should be paired with appropriate ordering and filtering to minimize result sets.
  - Ads system benefits from type/placement/status filtering for efficient campaign management.
- Data types:
  - Integer cents for monetary values prevent floating-point precision issues.
  - JSON fields (benefits, media_cdns) offer flexibility but should be validated and kept minimal.
  - Denormalized counters (impressions, clicks) improve read performance but require transactional updates for consistency.

## Troubleshooting Guide
- Duplicate email on signup:
  - Symptom: Insert fails due to unique email.
  - Resolution: Validate email availability before insert; surface user-friendly error messages.
- Missing subscription details:
  - Symptom: subscriptionStatus 1 but no subscription record.
  - Resolution: Ensure subscription creation on plan purchase; verify foreign key integrity.
- Whitelabel media signing failures:
  - Symptom: Empty or null signed URLs.
  - Resolution: Verify S3 key existence and permissions; handle missing keys gracefully.
- Checkout linkage:
  - Symptom: checkouts.userId is null unexpectedly.
  - Resolution: Capture user context during checkout; ensure referential integrity.
- Ad placement validation errors:
  - Symptom: Attempt to set invalid placement for ad type.
  - Resolution: Use isValidPlacement() function or default placement validation; ensure type/placement compatibility.
- Analytics tracking failures:
  - Symptom: Missing impression/click data in analytics.
  - Resolution: Verify IntersectionObserver implementation and API route accessibility; check transaction rollback scenarios.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L11-L12)
- [models.ts](file://src/services/whitelabel/queries/models.ts#L26-L33)
- [posts.ts](file://src/services/whitelabel/queries/posts.ts#L16-L32)
- [mappers.ts](file://src/services/admin/mappers.ts#L27-L31)
- [ads.ts](file://src/services/ads.ts#L34-L36)
- [AdBanner.tsx](file://src/components/molecules/AdBanner.tsx#L39-L53)

## Conclusion
CreatorFlix's core data model cleanly separates user accounts, subscription lifecycle, plan definitions, and content entities. The enhanced Ads system provides comprehensive advertising capabilities with detailed analytics tracking, placement targeting, and automated impression tracking. Whitelabel variants support scalable external content ingestion. Consistent constraints, enums, and foreign keys ensure data integrity, while frontend pages and service queries demonstrate practical usage patterns. Following the outlined business rules and query patterns will help maintain a robust and extensible system with advanced monetization capabilities.

## Appendices

### Common Query Patterns
- List whitelabel models with pagination and enriched thumbnails:
  - SELECT models ORDER BY createdAt DESC LIMIT N OFFSET (page-1)*N; JOIN whitelabel_posts/media to find first image per model; sign S3 keys.
- Get posts by modelId with signed media:
  - SELECT whitelabel_posts WHERE whitelabelModelId; parse media_cdns JSON; sign images/videos; select first image as thumbnail.
- Get top whitelabel models by postCount:
  - SELECT whitelabelModels ORDER BY postCount DESC LIMIT N OFFSET ...
- Admin: Update plan pricing and payment acceptance:
  - POST form to update price, checkoutUrl (gateway-dependent), acceptsPix, acceptsCard.
- Ads: Get active ads by placement with analytics:
  - SELECT ads WHERE status='active' AND placement=? AND (startDate IS NULL OR startDate<=NOW()) AND (endDate IS NULL OR endDate>=NOW()) ORDER BY priority DESC, createdAt DESC LIMIT N; JOIN impressions/clicks for analytics.
- Ads: Track impression with metadata:
  - UPDATE ads SET impressions=impressions+1 WHERE id=?; INSERT INTO impressions (ad_id, placement, user_agent, ip) VALUES (?, ?, ?, ?).

**Section sources**
- [models.ts](file://src/services/whitelabel/queries/models.ts#L36-L74)
- [posts.ts](file://src/services/whitelabel/queries/posts.ts#L7-L35)
- [AdminPlans.tsx](file://src/pages/admin/Plans.tsx#L30-L102)
- [ads.ts](file://src/services/ads.ts#L307-L331)
- [ads.ts](file://src/services/ads.ts#L246-L266)