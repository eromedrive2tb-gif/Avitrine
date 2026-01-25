# Database Design

<cite>
**Referenced Files in This Document**
- [schema.ts](file://src/db/schema.ts)
- [index.ts](file://src/db/index.ts)
- [drizzle.config.ts](file://drizzle.config.ts)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql)
- [0001_chunky_thunderbolts.sql](file://drizzle/0001_chunky_thunderbolts.sql)
- [0002_sparkling_madripoor.sql](file://drizzle/0002_sparkling_madripoor.sql)
- [0003_deep_thunderbird.sql](file://drizzle/0003_deep_thunderbird.sql)
- [0004_mixed_vermin.sql](file://drizzle/0004_mixed_vermin.sql)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql)
- [0007_orange_toad_men.sql](file://drizzle/0007_orange_toad_men.sql)
- [0008_stiff_toro.sql](file://drizzle/0008_stiff_toro.sql)
- [0009_order_bumps.sql](file://drizzle/0009_order_bumps.sql)
- [0010_ads_table.sql](file://drizzle/0010_ads_table.sql)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql)
- [_journal.json](file://drizzle/meta/_journal.json)
- [ads.ts](file://src/services/ads.ts)
- [models.ts](file://src/services/whitelabel/queries/models.ts)
- [posts.ts](file://src/services/whitelabel/queries/posts.ts)
- [persistence.ts](file://src/services/whitelabel/sync/persistence.ts)
</cite>

## Update Summary
**Changes Made**
- Added comprehensive advertising system with dedicated `ads`, `impressions`, and `clicks` tables
- Enhanced ad campaign schema with placement validation and type-specific restrictions
- Implemented real-time analytics tracking with separate event tables
- Added sophisticated ad targeting and scheduling capabilities
- Integrated ad service layer with placement validation and automatic tracking

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
This document describes the CreatorFlix database schema and data model. It covers entity definitions, relationships, constraints, indexes, and business rules related to users, subscriptions, plans, models, posts, checkouts, administrative entities, and the newly added advertising system. It also documents data access patterns, synchronization strategies, and operational considerations derived from the schema and service implementations.

## Project Structure
The database layer is defined with Drizzle ORM and PostgreSQL. The schema is declared in TypeScript and migrated via Drizzle Kit. The connection is established at runtime using a connection string from environment variables. Recent additions include a comprehensive advertising system with real-time tracking capabilities.

```mermaid
graph TB
subgraph "Schema Layer"
S["schema.ts<br/>Table and relation definitions"]
end
subgraph "Runtime"
C["index.ts<br/>Connection and drizzle client"]
CFG["drizzle.config.ts<br/>Drizzle config"]
end
subgraph "Migrations"
M0["0000...sql"]
M1["0001...sql"]
M2["0002...sql"]
M3["0003...sql"]
M4["0004...sql"]
M5["0005...sql"]
M6["0006...sql"]
M7["0007...sql"]
M8["0008...sql"]
M9["0009...sql"]
M10["0010_ads_table.sql<br/>Ad Campaign Schema"]
M11["0011_ads_tracking.sql<br/>Analytics Tracking"]
J["_journal.json"]
end
S --> C
CFG --> S
M0 --> J
M1 --> J
M2 --> J
M3 --> J
M4 --> J
M5 --> J
M6 --> J
M7 --> J
M8 --> J
M9 --> J
M10 --> J
M11 --> J
```

**Diagram sources**
- [schema.ts](file://src/db/schema.ts#L1-L253)
- [index.ts](file://src/db/index.ts#L1-L8)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L1-L80)
- [0001_chunky_thunderbolts.sql](file://drizzle/0001_chunky_thunderbolts.sql#L1-L14)
- [0002_sparkling_madripoor.sql](file://drizzle/0002_sparkling_madripoor.sql#L1-L1)
- [0003_deep_thunderbird.sql](file://drizzle/0003_deep_thunderbird.sql#L1-L1)
- [0004_mixed_vermin.sql](file://drizzle/0004_mixed_vermin.sql#L1-L12)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L1-L11)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L1-L18)
- [0007_orange_toad_men.sql](file://drizzle/0007_orange_toad_men.sql#L1-L1)
- [0008_stiff_toro.sql](file://drizzle/0008_stiff_toro.sql#L1-L1)
- [0009_order_bumps.sql](file://drizzle/0009_order_bumps.sql#L1-L1)
- [0010_ads_table.sql](file://drizzle/0010_ads_table.sql#L1-L21)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L1-L21)
- [_journal.json](file://drizzle/meta/_journal.json#L1-L83)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L1-L253)
- [index.ts](file://src/db/index.ts#L1-L8)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [_journal.json](file://drizzle/meta/_journal.json#L1-L83)

## Core Components
This section enumerates entities, their fields, data types, constraints, and indexes, and highlights primary/foreign keys and unique constraints.

- Users
  - Fields: id (serial, PK), name (text), email (text, not null, unique), password (text, not null), role (text enum: admin, user, default user), subscriptionStatus (integer, default 0), createdAt (timestamp, default now)
  - Indexes/Constraints: unique(email); default role and subscriptionStatus
  - Notes: subscriptionStatus was altered to integer with default 0 in later migrations

- Plans
  - Fields: id (serial, PK), name (text, not null), price (integer, not null), duration (integer, not null), benefits (json), ctaText (text), checkoutUrl (text), acceptsPix (boolean, default true), acceptsCard (boolean, default true)
  - Indexes/Constraints: none explicitly defined beyond PK

- Payment Gateways
  - Fields: id (serial, PK), name (text, not null, unique), publicKey (text), secretKey (text), postbackUrl (text), isActive (boolean, default false)
  - Indexes/Constraints: unique(name)

- Subscriptions
  - Fields: id (serial, PK), userId (integer, FK to users.id), planId (integer, FK to plans.id), externalId (text), startDate (timestamp), endDate (timestamp), status (text enum: active, expired, pending, default pending), createdAt (timestamp, default now)
  - Indexes/Constraints: FKs to users and plans; status default pending; start/end nullable per migration

- Models
  - Fields: id (serial, PK), name (text, not null), description (text), iconUrl (text), bannerUrl (text), isFeatured (boolean, default false), isAdvertiser (boolean, default false), createdAt (timestamp, default now)
  - Indexes/Constraints: none

- Posts
  - Fields: id (serial, PK), modelId (integer, FK to models.id), title (text), contentUrl (text, not null), type (text enum: image, video), createdAt (timestamp, default now)
  - Indexes/Constraints: FK to models; type not null

- Admin Settings
  - Fields: key (text, PK), value (text, not null)
  - Indexes/Constraints: primary key on key

- Whitelabel Models
  - Fields: id (serial, PK), folderName (text, not null, unique), thumbnailUrl (text), iconUrl (text), bannerUrl (text), postCount (integer, default 0), status (text enum: new, active, hidden, default new), lastSyncedAt (timestamp, default now), createdAt (timestamp, default now)
  - Indexes/Constraints: unique(folderName)

- Whitelabel Posts
  - Fields: id (serial, PK), whitelabelModelId (integer, FK to whitelabel_models.id, cascade delete), folderName (text, not null), title (text), mediaCdns (json), createdAt (timestamp, default now)
  - Indexes/Constraints: unique(whitelabelModelId, folderName)

- Whitelabel Media
  - Fields: id (serial, PK), whitelabelPostId (integer, FK to whitelabel_posts.id, cascade delete), s3Key (text, not null, unique), url (text), type (text enum: image, video), createdAt (timestamp, default now)
  - Indexes/Constraints: unique(s3Key)

- Support Contacts
  - Fields: id (serial, PK), platform (text, not null), url (text, not null), isActive (boolean, default true), updatedAt (timestamp, default now, on update now)
  - Indexes/Constraints: none

- Checkouts
  - Fields: id (serial, PK), userId (integer, FK to users.id), planId (integer, FK to plans.id), externalId (text), status (text enum: pending, paid, failed, abandoned, default pending), paymentMethod (text enum: pix, credit_card), orderBump (boolean, default false), orderBumpIds (json), totalAmount (integer, not null), customerName (text), customerEmail (text), customerDocument (text), customerPhone (text), createdAt (timestamp, default now), updatedAt (timestamp, default now, on update now)
  - Indexes/Constraints: FKs to users and plans; defaults and enums as listed

- **New** Ads Campaigns
  - Fields: id (serial, PK), name (text, not null), type (text enum: diamond, diamond_block, banner, spot, hero, default banner), placement (text enum with 12 positions, default home_top), status (text enum: active, paused, draft, default draft), title (text, not null), subtitle (text), ctaText (text), imageUrl (text), link (text, not null), category (text), impressions (integer, default 0), clicks (integer, default 0), priority (integer, default 0), startDate (timestamp), endDate (timestamp), createdAt (timestamp, default now), updatedAt (timestamp, default now, on update now)
  - Indexes/Constraints: none; includes comprehensive placement validation and type-specific restrictions

- **New** Impressions Tracking
  - Fields: id (serial, PK), adId (integer, FK to ads.id, cascade delete), placement (text), userAgent (text), ip (text), createdAt (timestamp, default now)
  - Indexes/Constraints: FK to ads with cascade delete

- **New** Clicks Tracking
  - Fields: id (serial, PK), adId (integer, FK to ads.id, cascade delete), placement (text), userAgent (text), ip (text), createdAt (timestamp, default now)
  - Indexes/Constraints: FK to ads with cascade delete

- Order Bumps
  - Fields: id (serial, PK), name (text, not null), description (text), price (integer, not null), isActive (boolean, default true), imageUrl (text), displayOrder (integer, default 0), createdAt (timestamp, default now)
  - Indexes/Constraints: none

Notes on schema evolution:
- Initial snapshot added users, models, posts, whitelabel models, posts, and media.
- Subscriptions table added with FKs to users/plans.
- Plans gained duration column.
- Users gained name column and subscriptionStatus altered to integer with default 0.
- Support contacts table added.
- Payment gateways table added with unique name.
- Checkouts table added with FKs to users/plans.
- **New** Ads table added with comprehensive ad campaign schema including type, placement, status, content fields, statistics counters, and scheduling.
- **New** Impressions and clicks tracking tables added with foreign key relationships to ads table.
- **New** Order bumps table added for upsell functionality.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L6-L253)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L1-L80)
- [0001_chunky_thunderbolts.sql](file://drizzle/0001_chunky_thunderbolts.sql#L1-L14)
- [0002_sparkling_madripoor.sql](file://drizzle/0002_sparkling_madripoor.sql#L1-L1)
- [0003_deep_thunderbird.sql](file://drizzle/0003_deep_thunderbird.sql#L1-L1)
- [0004_mixed_vermin.sql](file://drizzle/0004_mixed_vermin.sql#L1-L12)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L1-L11)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L1-L18)
- [0010_ads_table.sql](file://drizzle/0010_ads_table.sql#L1-L21)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L1-L21)

## Architecture Overview
The database architecture centers on a central schema with explicit relations and cascading deletes for whitelabel hierarchical data. The addition of the advertising system introduces real-time analytics tracking with separate event tables and sophisticated placement validation. Drizzle ORM provides type-safe SQL generation and runtime connection management.

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
PAYMENT_GATEWAYS {
serial id PK
text name UK
text public_key
text secret_key
text postback_url
boolean is_active
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
text external_id
text status
text payment_method
boolean order_bump
json order_bump_ids
integer total_amount
text customer_name
text customer_email
text customer_document
text customer_phone
timestamp created_at
timestamp updated_at
}
ADS {
serial id PK
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
integer impressions
integer clicks
integer priority
timestamp start_date
timestamp end_date
timestamp created_at
timestamp updated_at
}
IMPRESSIONS {
serial id PK
integer ad_id FK
text placement
text user_agent
text ip
timestamp created_at
}
CLICKS {
serial id PK
integer ad_id FK
text placement
text user_agent
text ip
timestamp created_at
}
ORDER_BUMPS {
serial id PK
text name
text description
integer price
boolean is_active
text image_url
integer display_order
timestamp created_at
}
USERS ||--o{ SUBSCRIPTIONS : "has"
USERS ||--o{ CHECKOUTS : "creates"
PLANS ||--o{ SUBSCRIPTIONS : "subscribed_by"
PLANS ||--o{ CHECKOUTS : "selected_for"
MODELS ||--o{ POSTS : "contains"
WHITELABEL_MODELS ||--o{ WHITELABEL_POSTS : "contains"
WHITELABEL_POSTS ||--o{ WHITELABEL_MEDIA : "contains"
ADS ||--o{ IMPRESSIONS : "tracked_by"
ADS ||--o{ CLICKS : "tracked_by"
```

**Diagram sources**
- [schema.ts](file://src/db/schema.ts#L6-L253)

## Detailed Component Analysis

### Users and Authentication
- Purpose: Store identities, roles, and subscription status indicators.
- Constraints: Unique email; default role and subscriptionStatus.
- Access patterns: Auth services rely on email/password; relations connect to subscriptions and checkouts.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L6-L14)
- [schema.ts](file://src/db/schema.ts#L131-L137)

### Plans and Pricing
- Purpose: Define subscription offerings with pricing, duration, and payment method flags.
- Constraints: Not null price and duration; optional benefits JSON; payment acceptance flags.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L16-L27)
- [0002_sparkling_madripoor.sql](file://drizzle/0002_sparkling_madripoor.sql#L1-L1)

### Payment Gateways
- Purpose: Manage external payment provider credentials, postback URLs, and activation state.
- Constraints: Unique name.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L29-L36)
- [0005_furry_catseye.sql](file://drizzle/0005_furry_catseye.sql#L1-L11)

### Subscriptions
- Purpose: Track user subscriptions, plan associations, and lifecycle.
- Constraints: Status defaults to pending; FKs to users and plans; nullable start/end dates per migration.
- Business rules:
  - Status transitions governed by external events and internal updates.
  - External identifiers stored for reconciliation.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L38-L47)
- [0001_chunky_thunderbolts.sql](file://drizzle/0001_chunky_thunderbolts.sql#L1-L14)
- [0004_mixed_vermin.sql](file://drizzle/0004_mixed_vermin.sql#L1-L12)

### Models and Posts
- Purpose: Content catalog for creators and their media assets.
- Constraints: Posts require contentUrl and type; FK from posts to models.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L49-L67)

### Admin Settings
- Purpose: Centralized key-value configuration for admin controls.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L69-L72)

### Whitelabel Entities
- Purpose: Hierarchical content ingestion and synchronization pipeline.
- Entities:
  - whitelabel_models: top-level model container with counts and status.
  - whitelabel_posts: per-model folders with media CDN aggregation.
  - whitelabel_media: individual media items with S3 key uniqueness.
- Constraints:
  - Unique folderName for whitelabel_models.
  - Composite unique on (whitelabelModelId, folderName) for whitelabel_posts.
  - Unique s3Key for whitelabel_media.
- Cascading:
  - Deletes on whitelabel_models cascade to posts and media.
  - Deletes on whitelabel_posts cascade to media.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L74-L104)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L55-L76)

### Support Contacts
- Purpose: Platform contact channels and activity tracking.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L106-L112)

### Checkouts
- Purpose: Track purchase attempts, payment methods, and customer data.
- Constraints: Defaults and enums; FKs to users and plans; timestamps auto-updated.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L114-L130)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L1-L18)

### **New** Advertising System
- Purpose: Comprehensive ad campaign management with real-time analytics tracking.
- Entities:
  - ads: Main ad campaign table with type, placement, status, content, and statistics.
  - impressions: Event tracking for ad views with metadata.
  - clicks: Event tracking for ad clicks with metadata.
- Ad Types and Placement Validation:
  - diamond: Post-style ads, only valid for feed_model placement.
  - diamond_block: Native block ads, valid for home_top, home_middle, models_grid.
  - banner: Standard banners, valid for home_top, home_bottom, login, register.
  - spot: Small ads, valid for sidebar, model_profile, model_sidebar.
  - hero: Hero carousel, only valid for home_top placement.
- Statistics Tracking:
  - Denormalized counters (impressions, clicks) for performance optimization.
  - Separate event tables for detailed analytics and debugging.
- Scheduling and Priority:
  - Start/end dates for campaign timing.
  - Priority system for ad selection.
  - Status management (active, paused, draft).

**Section sources**
- [schema.ts](file://src/db/schema.ts#L196-L253)
- [0010_ads_table.sql](file://drizzle/0010_ads_table.sql#L1-L21)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L1-L21)
- [ads.ts](file://src/services/ads.ts#L1-L380)

### **New** Order Bumps
- Purpose: Upsell functionality for subscription purchases.
- Fields: id (PK), name (text, not null), description (text), price (integer, not null), isActive (boolean, default true), imageUrl (text), displayOrder (integer, default 0), createdAt (timestamp, default now)
- Constraints: None beyond PK; designed for flexible upsell options.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L132-L141)
- [0009_order_bumps.sql](file://drizzle/0009_order_bumps.sql#L1-L1)

### Data Access Patterns and Synchronization
- Listing and pagination:
  - Whitelabel models and posts queries support pagination and ordering by creation date or counts.
  - Ads service provides comprehensive filtering by status, placement, and type.
- Aggregation and enrichment:
  - Thumbnails are enriched by joining media and posts; S3 keys are signed for secure delivery.
  - Ad campaigns support complex filtering with date ranges and status combinations.
- Persistence:
  - Upserts and conflict handling:
    - Insert models and posts with conflict-do-nothing semantics.
    - Update media by unique s3Key to avoid duplication.
  - Aggregate recomputation:
    - Recompute post_count per model and media_cdns per post using SQL aggregation.
- **New** Analytics Tracking:
  - Ads service uses transactions to ensure atomic updates to both denormalized counters and event logs.
  - Automatic impression tracking for ad display with metadata collection.

```mermaid
sequenceDiagram
participant Client as "Client Request"
participant AdsSvc as "Ads Service"
participant DB as "Database"
Client->>AdsSvc : getActiveByPlacement(placement, track=true)
AdsSvc->>DB : select active ads by placement and date
DB-->>AdsSvc : Ad[] results
loop For each ad
AdsSvc->>AdsSvc : trackImpression(ad.id, metadata)
AdsSvc->>DB : transaction begin
AdsSvc->>DB : update ads set impressions + 1
AdsSvc->>DB : insert impressions event
DB-->>AdsSvc : transaction commit
end
AdsSvc-->>Client : Ad[] with automatic tracking
```

**Diagram sources**
- [ads.ts](file://src/services/ads.ts#L307-L331)

**Section sources**
- [ads.ts](file://src/services/ads.ts#L1-L380)
- [models.ts](file://src/services/whitelabel/queries/models.ts#L6-L93)
- [posts.ts](file://src/services/whitelabel/queries/posts.ts#L6-L46)
- [persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L6-L92)

### Validation and Business Rules
- Authentication:
  - Users must have unique emails; passwords are stored as hashed values elsewhere in the stack.
- Subscription lifecycle:
  - Status defaults to pending; start/end dates may be null until confirmed.
- Payments:
  - Checkouts capture customer info and payment method; amounts are stored in smallest currency unit.
- Content management:
  - Posts require contentUrl and type; media uniqueness enforced by s3Key.
- Whitelabel ingestion:
  - Conflict handling prevents duplicates; cascading ensures referential integrity.
- **New** Ad Campaign Management:
  - Type-specific placement validation prevents invalid ad configurations.
  - Status management ensures proper campaign lifecycle control.
  - Date-based scheduling prevents ads from displaying outside their configured periods.
  - Priority-based selection ensures optimal ad placement ordering.

**Section sources**
- [schema.ts](file://src/db/schema.ts#L6-L253)
- [0001_chunky_thunderbolts.sql](file://drizzle/0001_chunky_thunderbolts.sql#L1-L14)
- [0006_overconfident_titania.sql](file://drizzle/0006_overconfident_titania.sql#L1-L18)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L55-L76)
- [ads.ts](file://src/services/ads.ts#L11-L36)

## Dependency Analysis
- Drizzle ORM defines tables and relations in schema.ts and binds them to a PostgreSQL client in index.ts.
- Migrations evolve the schema over time and are tracked in _journal.json.
- Services depend on schema definitions for queries and persistence.
- **New** Ads service depends on schema definitions for ad management and analytics tracking.

```mermaid
graph LR
Schema["schema.ts"] --> Runtime["index.ts"]
Config["drizzle.config.ts"] --> Schema
Migs["*.sql"] --> Journal["_journal.json"]
Runtime --> Services["Service Queries"]
Services --> Schema
AdsService["ads.ts"] --> Schema
```

**Diagram sources**
- [schema.ts](file://src/db/schema.ts#L1-L253)
- [index.ts](file://src/db/index.ts#L1-L8)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [_journal.json](file://drizzle/meta/_journal.json#L1-L83)
- [ads.ts](file://src/services/ads.ts#L1-L380)

**Section sources**
- [schema.ts](file://src/db/schema.ts#L1-L253)
- [index.ts](file://src/db/index.ts#L1-L8)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [_journal.json](file://drizzle/meta/_journal.json#L1-L83)
- [ads.ts](file://src/services/ads.ts#L1-L380)

## Performance Considerations
- Indexing and constraints:
  - Unique indexes on email, folderName, and s3Key reduce duplicate writes and improve lookup performance.
  - Composite unique on (whitelabelModelId, folderName) optimizes whitelabel post retrieval.
- Aggregation efficiency:
  - Recomputing aggregates via SQL avoids N+1 queries and reduces application-side computation.
- Batch operations:
  - Upserts with conflict handling minimize redundant inserts during sync.
- Query patterns:
  - Ordering by createdAt or postCount supports efficient pagination and trending views.
- Connection management:
  - Drizzle client reuse avoids connection overhead.
- **New** Analytics Performance:
  - Denormalized counters (impressions, clicks) in ads table provide O(1) read performance for basic metrics.
  - Separate event tables (impressions, clicks) provide detailed analytics without impacting main table performance.
  - Foreign key relationships with cascade delete ensure referential integrity for analytics data.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Duplicate entries:
  - Use on conflict do nothing for whitelabel models and posts; on conflict do update for media by s3Key.
- Cascade deletion:
  - Deleting a whitelabel model removes dependent posts and media automatically.
  - **New** Deleting an ad removes associated impressions and clicks events automatically.
- Timestamp updates:
  - updatedAt fields are managed via default and onUpdate clauses; verify triggers if not updating.
- Migration drift:
  - Review _journal.json to confirm applied migrations and reconcile schema snapshots.
- **New** Ad Placement Issues:
  - Use isValidPlacement() function to validate ad placement against ad type.
  - Check VALID_PLACEMENTS_BY_TYPE mapping for supported combinations.
- **New** Analytics Tracking:
  - Verify foreign key constraints between ads and tracking tables.
  - Ensure transaction usage for atomic counter updates and event logging.

**Section sources**
- [persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L17-L54)
- [schema.ts](file://src/db/schema.ts#L92-L94)
- [0000_special_white_queen.sql](file://drizzle/0000_special_white_queen.sql#L78-L80)
- [_journal.json](file://drizzle/meta/_journal.json#L1-L83)
- [ads.ts](file://src/services/ads.ts#L34-L36)
- [0011_ads_tracking.sql](file://drizzle/0011_ads_tracking.sql#L19-L21)

## Conclusion
CreatorFlix employs a normalized PostgreSQL schema with Drizzle ORM for type-safe operations. The design balances referential integrity, unique constraints, and efficient aggregation for whitelabel content. Recent additions of the advertising system provide comprehensive campaign management with real-time analytics tracking, while maintaining referential integrity and performance optimization. Migrations track schema evolution, while service-layer queries and persistence routines enforce business rules and optimize performance across all system components.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Appendix A: Sample Data Structures
- Users
  - Example fields: id, name, email, role, subscriptionStatus, createdAt
- Plans
  - Example fields: id, name, price, duration, benefits, ctaText, checkoutUrl, acceptsPix, acceptsCard
- Subscriptions
  - Example fields: id, userId, planId, externalId, startDate, endDate, status, createdAt
- Models
  - Example fields: id, name, description, iconUrl, bannerUrl, isFeatured, isAdvertiser, createdAt
- Posts
  - Example fields: id, modelId, title, contentUrl, type, createdAt
- Admin Settings
  - Example fields: key, value
- Whitelabel Models
  - Example fields: id, folderName, thumbnailUrl, iconUrl, bannerUrl, postCount, status, lastSyncedAt, createdAt
- Whitelabel Posts
  - Example fields: id, whitelabelModelId, folderName, title, mediaCdns, createdAt
- Whitelabel Media
  - Example fields: id, whitelabelPostId, s3Key, url, type, createdAt
- Support Contacts
  - Example fields: id, platform, url, isActive, updatedAt
- Checkouts
  - Example fields: id, userId, planId, externalId, status, paymentMethod, orderBump, orderBumpIds, totalAmount, customerName, customerEmail, customerDocument, customerPhone, createdAt, updatedAt
- **New** Ads
  - Example fields: id, name, type, placement, status, title, subtitle, ctaText, imageUrl, link, category, impressions, clicks, priority, startDate, endDate, createdAt, updatedAt
- **New** Impressions
  - Example fields: id, adId, placement, userAgent, ip, createdAt
- **New** Clicks
  - Example fields: id, adId, placement, userAgent, ip, createdAt
- **New** Order Bumps
  - Example fields: id, name, description, price, isActive, imageUrl, displayOrder, createdAt

[No sources needed since this section provides general guidance]