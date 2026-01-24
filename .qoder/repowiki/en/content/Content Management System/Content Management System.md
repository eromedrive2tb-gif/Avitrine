# Content Management System

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [drizzle.config.ts](file://drizzle.config.ts)
- [src/db/index.ts](file://src/db/index.ts)
- [src/db/schema.ts](file://src/db/schema.ts)
- [src/services/s3.ts](file://src/services/s3.ts)
- [src/utils/storage.ts](file://src/utils/storage.ts)
- [src/services/whitelabel/sync.ts](file://src/services/whitelabel/sync.ts)
- [src/services/whitelabel/sync/parser.ts](file://src/services/whitelabel/sync/parser.ts)
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts)
- [src/services/whitelabel/queries/models.ts](file://src/services/whitelabel/queries/models.ts)
- [src/services/whitelabel/queries/posts.ts](file://src/services/whitelabel/queries/posts.ts)
- [src/services/admin.ts](file://src/services/admin.ts)
- [src/services/admin/activation.ts](file://src/services/admin/activation.ts)
- [src/services/admin/mappers.ts](file://src/services/admin/mappers.ts)
- [src/pages/admin/Whitelabel.tsx](file://src/pages/admin/Whitelabel.tsx)
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
CreatorFlix is a white-label content platform built with Bun and Hono, integrating DigitalOcean Spaces (S3-compatible) for media storage and PostgreSQL with Drizzle ORM for persistence. This document explains the multi-pass content synchronization algorithm, S3 integration, content parsing, database persistence, automated ingestion pipeline, media processing workflows, thumbnail generation, administrative controls, and operational best practices.

## Project Structure
The repository follows a modular structure:
- Services: S3 integration, whitelabel synchronization, admin operations, and storage utilities
- Database: Drizzle ORM schema and connection setup
- Pages and Components: Admin UI for whitelabel management
- Utilities: Storage helpers for uploads

```mermaid
graph TB
subgraph "Services"
S3["S3 Service<br/>src/services/s3.ts"]
WL_SYNC["Whitelabel Sync<br/>src/services/whitelabel/sync.ts"]
WL_PARSER["Key Parser<br/>src/services/whitelabel/sync/parser.ts"]
WL_PERSIST["Persistence Layer<br/>src/services/whitelabel/sync/persistence.ts"]
WL_Q_MODELS["Model Queries<br/>src/services/whitelabel/queries/models.ts"]
WL_Q_POSTS["Post Queries<br/>src/services/whitelabel/queries/posts.ts"]
ADMIN_ACT["Admin Activation<br/>src/services/admin/activation.ts"]
MAPPERS["Admin Mappers<br/>src/services/admin/mappers.ts"]
end
subgraph "Database"
DB_INDEX["DB Connection<br/>src/db/index.ts"]
SCHEMA["Schema<br/>src/db/schema.ts"]
DRIZZLE_CFG["Drizzle Config<br/>drizzle.config.ts"]
end
subgraph "UI"
ADMIN_PAGE["Admin Whitelabel Page<br/>src/pages/admin/Whitelabel.tsx"]
end
subgraph "Storage"
DO_SPACES["DigitalOcean Spaces<br/>S3-compatible"]
STORAGE_UTIL["Upload Utility<br/>src/utils/storage.ts"]
end
WL_SYNC --> S3
WL_SYNC --> WL_PARSER
WL_SYNC --> WL_PERSIST
WL_PERSIST --> DB_INDEX
DB_INDEX --> SCHEMA
WL_Q_MODELS --> DB_INDEX
WL_Q_POSTS --> DB_INDEX
ADMIN_ACT --> WL_SYNC
ADMIN_ACT --> MAPPERS
ADMIN_PAGE --> WL_Q_MODELS
ADMIN_PAGE --> WL_Q_POSTS
STORAGE_UTIL --> DO_SPACES
S3 --> DO_SPACES
```

**Diagram sources**
- [src/services/whitelabel/sync.ts](file://src/services/whitelabel/sync.ts#L1-L334)
- [src/services/whitelabel/sync/parser.ts](file://src/services/whitelabel/sync/parser.ts#L1-L59)
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L1-L94)
- [src/services/whitelabel/queries/models.ts](file://src/services/whitelabel/queries/models.ts#L1-L94)
- [src/services/whitelabel/queries/posts.ts](file://src/services/whitelabel/queries/posts.ts#L1-L47)
- [src/services/admin/activation.ts](file://src/services/admin/activation.ts#L1-L86)
- [src/services/admin/mappers.ts](file://src/services/admin/mappers.ts#L1-L40)
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/utils/storage.ts](file://src/utils/storage.ts#L1-L39)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [src/pages/admin/Whitelabel.tsx](file://src/pages/admin/Whitelabel.tsx#L1-L30)

**Section sources**
- [README.md](file://README.md#L1-L49)
- [package.json](file://package.json#L1-L23)

## Core Components
- S3 Integration: Provides S3 client configuration and signed URL generation for secure access to DigitalOcean Spaces.
- Whitelabel Sync Service: Implements a three-pass synchronization pipeline to discover, create, and persist models, posts, and media from S3.
- Parser: Interprets S3 keys into structured content types (model, post, media, profile media).
- Persistence Layer: Manages CRUD operations and aggregate updates using Drizzle ORM.
- Admin Activation: Bridges staging whitelabel content to production models and posts.
- Queries: Exposes paginated lists, top creators, and model/post statistics with signed CDN URLs.
- Storage Utilities: Upload helper for DigitalOcean Spaces.

**Section sources**
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/services/whitelabel/sync.ts](file://src/services/whitelabel/sync.ts#L1-L334)
- [src/services/whitelabel/sync/parser.ts](file://src/services/whitelabel/sync/parser.ts#L1-L59)
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L1-L94)
- [src/services/admin/activation.ts](file://src/services/admin/activation.ts#L1-L86)
- [src/services/whitelabel/queries/models.ts](file://src/services/whitelabel/queries/models.ts#L1-L94)
- [src/services/whitelabel/queries/posts.ts](file://src/services/whitelabel/queries/posts.ts#L1-L47)
- [src/utils/storage.ts](file://src/utils/storage.ts#L1-L39)

## Architecture Overview
The system synchronizes content from DigitalOcean Spaces into a PostgreSQL database via Drizzle ORM. Admins trigger activation to promote staged whitelabel content to production models and posts. Signed URLs enable secure content delivery.

```mermaid
sequenceDiagram
participant Admin as "Admin"
participant WL_SYNC as "WhitelabelSyncService"
participant S3 as "S3 Client"
participant PARSER as "S3KeyParser"
participant PERSIST as "WhitelabelPersistence"
participant DB as "PostgreSQL/Drizzle"
Admin->>WL_SYNC : "syncAllModels()"
WL_SYNC->>S3 : "ListObjectsV2(bucket, options)"
S3-->>WL_SYNC : "Objects list"
loop For each object
WL_SYNC->>PARSER : "parse(key)"
PARSER-->>WL_SYNC : "Parsed type and identifiers"
end
WL_SYNC->>PERSIST : "insertModels(newModels)"
PERSIST->>DB : "INSERT ... ON CONFLICT DO NOTHING"
DB-->>PERSIST : "Inserted ids"
PERSIST-->>WL_SYNC : "ids"
WL_SYNC->>PERSIST : "insertPosts(newPosts)"
PERSIST->>DB : "INSERT ... ON CONFLICT DO NOTHING"
DB-->>PERSIST : "Inserted ids"
PERSIST-->>WL_SYNC : "ids"
WL_SYNC->>PERSIST : "insertMedia(mediaItems)"
PERSIST->>DB : "INSERT ... ON CONFLICT DO UPDATE"
DB-->>PERSIST : "OK"
WL_SYNC->>PERSIST : "updateAggregates()"
PERSIST->>DB : "UPDATE aggregates"
DB-->>PERSIST : "OK"
WL_SYNC-->>Admin : "Sync stats"
```

**Diagram sources**
- [src/services/whitelabel/sync.ts](file://src/services/whitelabel/sync.ts#L1-L197)
- [src/services/whitelabel/sync/parser.ts](file://src/services/whitelabel/sync/parser.ts#L10-L58)
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L5-L92)

## Detailed Component Analysis

### Multi-Pass Content Synchronization Algorithm
The synchronization runs in three passes:
- Pass 1: Discover and insert models. Known models are loaded from the database to avoid duplicates.
- Pass 2: Discover and insert posts per model. Uses model ids resolved in Pass 1.
- Pass 3: Insert media items and update model profile fields (icon/banner) from profile media.

Deletion handling:
- After scanning, models and posts not seen during the scan are deleted to keep the database in sync with S3.

```mermaid
flowchart TD
Start(["Start syncAllModels"]) --> LoadState["Load known models and posts"]
LoadState --> ListObjects["List S3 objects (paged)"]
ListObjects --> ParseLoop["Parse keys"]
ParseLoop --> DetectModels{"New model?"}
DetectModels --> |Yes| AddModel["Add to newModels"]
DetectModels --> |No| Next1["Next item"]
AddModel --> Next1
Next1 --> DetectPosts{"Media under post?"}
DetectPosts --> |Yes| AddPost["Add to newPosts"]
DetectPosts --> |No| Next2["Next item"]
AddPost --> Next2
Next2 --> InsertModels["Persist new models"]
InsertModels --> Rescan["Rescan for posts (Pass 2)"]
Rescan --> InsertPosts["Persist new posts"]
InsertPosts --> InsertMedia["Rescan for media (Pass 3)"]
InsertMedia --> UpdateProfile["Update model profile (icon/banner)"]
UpdateProfile --> Aggregate["Update aggregates"]
Aggregate --> DeleteOrphans["Delete unseen models/posts"]
DeleteOrphans --> End(["Return stats"])
```

**Diagram sources**
- [src/services/whitelabel/sync.ts](file://src/services/whitelabel/sync.ts#L7-L197)

**Section sources**
- [src/services/whitelabel/sync.ts](file://src/services/whitelabel/sync.ts#L1-L197)

### S3 Integration with DigitalOcean Spaces
- Client configuration defines region, endpoint, credentials, and bucket.
- Signed URLs are generated for secure access to S3 objects.
- Upload utility supports public uploads to Spaces with proper MIME types.

```mermaid
graph LR
S3CFG["S3_CONFIG<br/>src/services/s3.ts"] --> S3CLIENT["s3Client"]
S3CLIENT --> LIST["ListObjectsV2"]
S3CLIENT --> SIGN["signS3Key()"]
UPLOAD["uploadToSpaces()<br/>src/utils/storage.ts"] --> SPACES["DigitalOcean Spaces"]
LIST --> SPACES
SIGN --> SPACES
```

**Diagram sources**
- [src/services/s3.ts](file://src/services/s3.ts#L4-L47)
- [src/utils/storage.ts](file://src/utils/storage.ts#L1-L39)

**Section sources**
- [src/services/s3.ts](file://src/services/s3.ts#L1-L48)
- [src/utils/storage.ts](file://src/utils/storage.ts#L1-L39)

### Content Parsing Mechanisms
The parser interprets S3 keys into structured types:
- Model-level images: "ModelName/file.jpg"
- Post content: "ModelName/PostName/file.ext"
- Profile media: "ModelName/profile/file.ext"
- Media classification distinguishes images and videos.

```mermaid
flowchart TD
A["Input key"] --> B{"Ends with '/'?"}
B --> |Yes| U["unknown"]
B --> |No| C["Split by '/'"]
C --> D{"Parts length == 2?"}
D --> |Yes| E{"Is image?"}
E --> |Yes| M["model"]
E --> |No| U
D --> |No| F{"Parts length >= 3?"}
F --> |No| U
F --> |Yes| G{"postName == 'profile'?"}
G --> |Yes| H{"Is image?"}
H --> |Yes| PM["profile_media"]
H --> |No| U
G --> |No| I{"Is video?"}
I --> |Yes| MED["media (video)"]
I --> |No| MED2["media (image)"]
```

**Diagram sources**
- [src/services/whitelabel/sync/parser.ts](file://src/services/whitelabel/sync/parser.ts#L10-L58)

**Section sources**
- [src/services/whitelabel/sync/parser.ts](file://src/services/whitelabel/sync/parser.ts#L1-L59)

### Database Persistence Strategies
- Models, posts, and media are persisted with conflict handling:
  - Models and posts: upsert with conflict-do-nothing
  - Media: upsert with conflict-do-update
- Aggregates are updated after sync:
  - Model post counts
  - Post media CDNs aggregated as JSON with separate arrays for images and videos
- Foreign keys enforce referential integrity with cascade deletes.

```mermaid
erDiagram
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
WHITELABEL_MODELS ||--o{ WHITELABEL_POSTS : "has"
WHITELABEL_POSTS ||--o{ WHITELABEL_MEDIA : "contains"
```

**Diagram sources**
- [src/db/schema.ts](file://src/db/schema.ts#L73-L103)
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L5-L92)

**Section sources**
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L1-L94)

### Automated Content Ingestion Pipeline
- Admin triggers activation to process whitelabel staging into production models and posts.
- Activation orchestrates:
  - Sync model details
  - Upsert model into production
  - Upsert posts into production
  - Mark model active

```mermaid
sequenceDiagram
participant Admin as "Admin"
participant Act as "AdminActivationService"
participant WL as "WhitelabelDbService"
participant DB as "PostgreSQL/Drizzle"
participant Mapper as "AdminMappers"
Admin->>Act : "activateModels(all|specific)"
Act->>WL : "syncModelDetails(folder)"
WL-->>Act : "success"
Act->>DB : "Fetch staged model with posts"
Act->>Mapper : "mapModelToProduction()"
Mapper-->>Act : "Mapped model"
Act->>DB : "Upsert model"
Act->>Mapper : "mapPostToProduction(posts)"
Mapper-->>Act : "Mapped posts"
Act->>DB : "Upsert posts"
Act->>DB : "Set status = 'active'"
DB-->>Act : "OK"
Act-->>Admin : "Stats"
```

**Diagram sources**
- [src/services/admin/activation.ts](file://src/services/admin/activation.ts#L8-L55)
- [src/services/admin/mappers.ts](file://src/services/admin/mappers.ts#L3-L39)

**Section sources**
- [src/services/admin/activation.ts](file://src/services/admin/activation.ts#L1-L86)
- [src/services/admin/mappers.ts](file://src/services/admin/mappers.ts#L1-L40)

### Media Processing Workflows and Thumbnail Generation
- Media insertion records S3 keys and CDN URLs with type classification.
- Thumbnails are enriched by selecting a representative image per model and signing S3 keys for secure delivery.
- Post listings sign CDN URLs for images and videos to enable secure playback.

```mermaid
flowchart TD
A["Media rows"] --> B["Aggregate per post:<br/>images[], videos[]"]
B --> C["Store mediaCdns JSON"]
C --> D["Model queries:<br/>select representative image"]
D --> E["signS3Key(imageKey)"]
E --> F["Return signed thumbnail"]
C --> G["Post queries:<br/>sign CDN URLs for images/videos"]
G --> H["Return signed media arrays"]
```

**Diagram sources**
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L63-L92)
- [src/services/whitelabel/queries/models.ts](file://src/services/whitelabel/queries/models.ts#L7-L34)
- [src/services/whitelabel/queries/posts.ts](file://src/services/whitelabel/queries/posts.ts#L16-L32)

**Section sources**
- [src/services/whitelabel/sync/persistence.ts](file://src/services/whitelabel/sync/persistence.ts#L45-L92)
- [src/services/whitelabel/queries/models.ts](file://src/services/whitelabel/queries/models.ts#L1-L94)
- [src/services/whitelabel/queries/posts.ts](file://src/services/whitelabel/queries/posts.ts#L1-L47)

### Administrative Controls
- Admin activation service coordinates:
  - Determining folders to process (all or specific)
  - Processing each folder through sync and upsert
  - Updating model status to active
- Admin UI displays whitelabel status and pagination controls.

```mermaid
graph TB
ACT["AdminActivationService"] --> SYNC["syncModelDetails()"]
ACT --> UPSERT_M["Upsert Production Model"]
ACT --> UPSERT_P["Upsert Production Posts"]
ACT --> STATUS["Set status = 'active'"]
UI["AdminWhitelabel Page"] --> ACT
```

**Diagram sources**
- [src/services/admin/activation.ts](file://src/services/admin/activation.ts#L8-L55)
- [src/pages/admin/Whitelabel.tsx](file://src/pages/admin/Whitelabel.tsx#L15-L29)

**Section sources**
- [src/services/admin/activation.ts](file://src/services/admin/activation.ts#L1-L86)
- [src/pages/admin/Whitelabel.tsx](file://src/pages/admin/Whitelabel.tsx#L1-L30)

## Dependency Analysis
External dependencies include AWS SDK for S3, Drizzle ORM, Hono, and PostgreSQL driver. Drizzle Kit is used for migrations and schema management.

```mermaid
graph LR
PKG["package.json"] --> AWS["@aws-sdk/client-s3"]
PKG --> PRESIGN["@aws-sdk/s3-request-presigner"]
PKG --> DRIZZLE["drizzle-orm"]
PKG --> HONO["hono"]
PKG --> POSTGRES["postgres"]
DK["drizzle.config.ts"] --> SCHEMA["src/db/schema.ts"]
DK --> DBIDX["src/db/index.ts"]
```

**Diagram sources**
- [package.json](file://package.json#L8-L22)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)

**Section sources**
- [package.json](file://package.json#L1-L23)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)

## Performance Considerations
- Batch sizing: The sync uses a fixed page size for S3 listing; consider tuning based on workload.
- Conflict handling: Upserts minimize redundant writes; ensure indexes exist on conflict targets.
- Aggregation updates: JSON aggregation and count updates occur after bulk inserts; consider periodic recomputation for very large datasets.
- Signed URL caching: Cache signed URLs server-side to reduce repeated signing overhead.
- CDN delivery: Serve media via DigitalOcean CDN endpoints to improve latency and bandwidth utilization.

## Troubleshooting Guide
Common issues and resolutions:
- Authentication failures with Spaces:
  - Verify region, endpoint, and credentials in S3 configuration.
  - Confirm bucket name and permissions.
- Signed URL errors:
  - Ensure keys are properly decoded and percent-encoded.
  - Validate that objects exist and are publicly readable.
- Sync inconsistencies:
  - Run deletion cleanup to remove orphaned models/posts.
  - Re-run sync with prefix for targeted folders.
- Migration and schema drift:
  - Use Drizzle Kit to generate and apply migrations.
  - Confirm DATABASE_URL environment variable and connection string.

**Section sources**
- [src/services/s3.ts](file://src/services/s3.ts#L25-L47)
- [src/services/whitelabel/sync.ts](file://src/services/whitelabel/sync.ts#L154-L197)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [src/db/index.ts](file://src/db/index.ts#L5-L7)

## Conclusion
CreatorFlix’s content management system integrates DigitalOcean Spaces with a robust synchronization pipeline, structured parsing, and efficient persistence. Admin activation streamlines onboarding and moderation, while signed URLs and CDN aggregation ensure secure and performant content delivery.

## Appendices
- Environment variables to configure:
  - DATABASE_URL for PostgreSQL connection
  - DO_SPACES_ENDPOINT, DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_BUCKET for Spaces uploads
- Operational tasks:
  - Generate and apply migrations using Drizzle Kit
  - Monitor sync stats and adjust batch sizes
  - Review and approve whitelabel content in the Admin UI