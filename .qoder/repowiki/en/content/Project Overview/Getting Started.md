# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [tsconfig.json](file://tsconfig.json)
- [tailwind.config.js](file://tailwind.config.js)
- [drizzle.config.ts](file://drizzle.config.ts)
- [src/index.tsx](file://src/index.tsx)
- [src/db/index.ts](file://src/db/index.ts)
- [src/db/schema.ts](file://src/db/schema.ts)
- [src/routes/public.tsx](file://src/routes/public.tsx)
- [src/routes/admin.tsx](file://src/routes/admin.tsx)
- [src/routes/api.tsx](file://src/routes/api.tsx)
- [src/input.css](file://src/input.css)
- [bun.lock](file://bun.lock)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Installation and Setup](#installation-and-setup)
6. [Environment Configuration](#environment-configuration)
7. [Database Setup](#database-setup)
8. [CSS Generation](#css-generation)
9. [Local Development Server](#local-development-server)
10. [Accessing the Application](#accessing-the-application)
11. [Practical Examples](#practical-examples)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Conclusion](#conclusion)

## Introduction
CreatorFlix is a premium content streaming platform built with modern web technologies. It follows an Atomic Design approach and provides both a public frontend and an administrative backend. The platform supports subscription-based access, payment processing via multiple gateways, and white-label model management.

## Project Structure
The project is organized around a clear separation of concerns:
- Runtime: Bun (JavaScript runtime)
- Framework: Hono (web framework)
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS v4
- Storage: AWS S3-compatible storage (DigitalOcean Spaces)

```mermaid
graph TB
subgraph "Runtime Layer"
Bun[Bun Runtime]
end
subgraph "Application Layer"
Hono[Hono Framework]
Routes[Route Handlers]
Services[Business Services]
end
subgraph "Data Layer"
DB[(PostgreSQL Database)]
ORM[Drizzle ORM]
Schema[Database Schema]
end
subgraph "Presentation Layer"
Public[Public Routes]
Admin[Admin Routes]
API[API Routes]
UI[React Components]
end
Bun --> Hono
Hono --> Routes
Routes --> Services
Services --> ORM
ORM --> DB
Routes --> UI
Public --> UI
Admin --> UI
API --> UI
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)

**Section sources**
- [README.md](file://README.md#L1-L49)
- [package.json](file://package.json#L1-L23)

## Core Components
The application consists of several key components working together:

### Database Layer
- **PostgreSQL**: Primary database for all application data
- **Drizzle ORM**: Type-safe database queries and migrations
- **Schema Definitions**: TypeScript-based table definitions with relationships

### Routing System
- **Public Routes**: Home page, model profiles, plans, authentication
- **Admin Routes**: Dashboard, models management, finance, settings
- **API Routes**: Authentication, checkout processing, webhook handlers

### Styling System
- **Tailwind CSS v4**: Utility-first CSS framework
- **Custom Theme**: Neon-themed dark interface with purple, blue, and gold accents
- **Atomic Design**: Component hierarchy from atoms to templates

**Section sources**
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- [tailwind.config.js](file://tailwind.config.js#L1-L39)

## Architecture Overview
The application follows a modular architecture with clear separation between public, admin, and API functionality:

```mermaid
sequenceDiagram
participant Client as "Browser Client"
participant Public as "Public Routes"
participant Admin as "Admin Routes"
participant API as "API Routes"
participant DB as "PostgreSQL Database"
participant S3 as "S3 Storage"
Client->>Public : GET /
Public->>DB : Fetch models & posts
DB-->>Public : Data
Public-->>Client : Render Home Page
Client->>Admin : GET /admin
Admin->>DB : Fetch admin data
DB-->>Admin : Admin data
Admin-->>Client : Render Admin Dashboard
Client->>API : POST /api/login
API->>DB : Verify credentials
DB-->>API : User data
API->>API : Generate JWT token
API-->>Client : Set auth cookie
Client->>API : GET /api/models
API->>DB : Query models
DB-->>API : Model data
API-->>Client : JSON response
Client->>API : POST /api/webhook/junglepay
API->>DB : Update subscription
DB-->>API : Confirmation
API-->>Client : Success response
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [src/routes/public.tsx](file://src/routes/public.tsx#L54-L64)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L18-L48)
- [src/routes/api.tsx](file://src/routes/api.tsx#L316-L349)

## Installation and Setup

### Prerequisites
Before installing CreatorFlix, ensure you have the following prerequisites:

1. **Bun Runtime**: JavaScript runtime for development
2. **PostgreSQL Database**: Version compatible with Drizzle ORM
3. **Node.js/npm**: For package management (though Bun is primary)
4. **Git**: For version control and cloning

### Step-by-Step Installation

#### 1. Clone and Navigate
```bash
git clone <repository-url>
cd creatorflix
```

#### 2. Install Dependencies
```bash
bun install
```

This command installs all required packages including:
- Hono web framework
- Drizzle ORM for database operations
- Tailwind CSS for styling
- AWS SDK for S3 integration
- Development tools and type definitions

#### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/creatorflix
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

#### 4. Database Setup
Create a PostgreSQL database named `creatorflix` and configure the connection string in your environment.

#### 5. Run Migrations (Optional)
```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

#### 6. Build CSS
```bash
bun run css:build
```

#### 7. Start Development Server
```bash
bun run dev
```

**Section sources**
- [README.md](file://README.md#L13-L42)
- [package.json](file://package.json#L3-L7)
- [bun.lock](file://bun.lock#L1-L534)

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/creatorflix` |
| `JWT_SECRET` | Secret key for JWT token signing | `super-secret-key-here` |
| `NODE_ENV` | Application environment | `development` |

### Database Configuration
The application connects to PostgreSQL using the connection string from the `DATABASE_URL` environment variable. The default connection string is configured in the database initialization file.

**Section sources**
- [src/db/index.ts](file://src/db/index.ts#L5-L6)
- [drizzle.config.ts](file://drizzle.config.ts#L7-L9)

## Database Setup

### Database Schema
The application uses a comprehensive schema supporting:
- User management with subscription tracking
- Model and content management
- Payment processing and financial tracking
- White-label model integration
- Administrative settings and configurations

### Migration Process
The database schema is defined in TypeScript files and can be migrated using Drizzle Kit:

```mermaid
flowchart TD
Start([Start Migration]) --> CheckSchema["Check Schema Changes"]
CheckSchema --> HasChanges{"Schema Changed?"}
HasChanges --> |Yes| GenerateSQL["Generate SQL Migration"]
HasChanges --> |No| SkipMigration["Skip Migration"]
GenerateSQL --> ReviewSQL["Review Generated SQL"]
ReviewSQL --> ApplyMigration["Apply Migration to Database"]
ApplyMigration --> Complete([Migration Complete])
SkipMigration --> Complete
```

**Diagram sources**
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)

**Section sources**
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)

## CSS Generation

### Tailwind CSS Configuration
The project uses Tailwind CSS v4 with a custom theme designed for a premium streaming interface:

```mermaid
graph LR
subgraph "CSS Pipeline"
Input[input.css]
Tailwind[Tailwind CSS v4]
PostCSS[PostCSS Processing]
Output[static/styles.css]
end
subgraph "Theme Configuration"
Colors[Neon Color Palette]
Typography[Custom Fonts]
Effects[Visual Effects]
end
Input --> Tailwind
Tailwind --> PostCSS
PostCSS --> Output
Colors --> Tailwind
Typography --> Tailwind
Effects --> Tailwind
```

**Diagram sources**
- [tailwind.config.js](file://tailwind.config.js#L1-L39)
- [src/input.css](file://src/input.css#L1-L268)

### Custom Theme Elements
- **Color Palette**: Dark void backgrounds (#050505), purple neon accents (#8A2BE2), electric blue (#00F0FF), and gold (#FFD700)
- **Typography**: "Bebas Neue" for display, "Inter" for body text
- **Effects**: Glass morphism, glow effects, and smooth animations
- **Responsive Design**: Mobile-first approach with adaptive layouts

**Section sources**
- [tailwind.config.js](file://tailwind.config.js#L6-L35)
- [src/input.css](file://src/input.css#L3-L17)

## Local Development Server

### Server Configuration
The development server runs on port 3000 and serves static assets from the root directory. The server configuration includes:

```mermaid
classDiagram
class HonoServer {
+port : 3000
+fetch(request) Response
+idleTimeout : 120
+serveStatic(root)
}
class RouteHandlers {
+publicRoutes : PublicRoutes
+adminRoutes : AdminRoutes
+apiRoutes : ApiRoutes
}
class StaticAssets {
+root : "./"
+serveStatic()
}
HonoServer --> RouteHandlers : mounts
HonoServer --> StaticAssets : serves
```

**Diagram sources**
- [src/index.tsx](file://src/index.tsx#L16-L21)

### Development Features
- **Hot Reloading**: Automatic server restarts on code changes
- **Static Asset Serving**: Direct serving of compiled CSS and JS
- **Idle Timeout**: 120-second timeout for long-running requests
- **Development Mode**: Optimized for rapid iteration

**Section sources**
- [src/index.tsx](file://src/index.tsx#L1-L21)
- [package.json](file://package.json#L4-L4)

## Accessing the Application

### Base URLs
Once the development server is running, access the application at:

- **Home Page**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`

### Authentication Flow
The application uses JWT tokens for user authentication:

```mermaid
sequenceDiagram
participant Browser as "User Browser"
participant Login as "Login Route"
participant Auth as "AuthService"
participant DB as "Database"
participant Cookie as "Auth Cookie"
Browser->>Login : Submit credentials
Login->>Auth : Verify credentials
Auth->>DB : Check user exists
DB-->>Auth : User data
Auth->>Auth : Hash password verification
Auth->>Auth : Create JWT token
Auth->>Cookie : Set auth_token cookie
Auth-->>Browser : Redirect to home
```

**Diagram sources**
- [src/routes/api.tsx](file://src/routes/api.tsx#L316-L349)

**Section sources**
- [README.md](file://README.md#L39-L42)
- [src/routes/public.tsx](file://src/routes/public.tsx#L18-L51)

## Practical Examples

### First-Time Setup Example
```bash
# 1. Install dependencies
bun install

# 2. Create database and set up environment
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/creatorflix" > .env

# 3. Generate and apply migrations
bunx drizzle-kit generate
bunx drizzle-kit migrate

# 4. Build CSS
bun run css:build

# 5. Start development server
bun run dev
```

### Accessing Different Sections
- **Public Content**: Navigate to `http://localhost:3000` to view models and content
- **User Authentication**: Go to `http://localhost:3000/login` or `http://localhost:3000/register`
- **Subscription Management**: After login, access plans at `http://localhost:3000/plans`
- **Admin Dashboard**: Visit `http://localhost:3000/admin` for administrative functions

### Testing API Endpoints
```bash
# Test authentication
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=password"

# Test model listing
curl http://localhost:3000/api/models?page=1
```

**Section sources**
- [README.md](file://README.md#L39-L42)
- [src/routes/public.tsx](file://src/routes/public.tsx#L81-L101)
- [src/routes/api.tsx](file://src/routes/api.tsx#L276-L293)

## Troubleshooting Guide

### Common Installation Issues

#### Bun Installation Problems
**Issue**: Bun fails to install dependencies
**Solution**: 
```bash
# Clear Bun cache
bun cache dir
rm -rf $(bun cache dir)

# Reinstall dependencies
bun install --reinstall
```

#### Database Connection Issues
**Issue**: Cannot connect to PostgreSQL
**Solution**:
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check connection string format
# DATABASE_URL should be: postgresql://username:password@host:port/database

# Test connection manually
psql $DATABASE_URL
```

#### CSS Build Failures
**Issue**: Tailwind CSS compilation errors
**Solution**:
```bash
# Clean build artifacts
rm -f static/styles.css

# Rebuild CSS
bun run css:build

# Check Tailwind configuration
tailwindcss -i ./src/input.css -o ./static/styles.css --watch
```

#### Port Conflicts
**Issue**: Port 3000 already in use
**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change port in src/index.tsx
# Change port from 3000 to another available port
```

### Runtime Issues

#### Authentication Problems
**Issue**: Users cannot log in or JWT tokens expire
**Solution**:
```bash
# Check JWT_SECRET environment variable
echo $JWT_SECRET

# Verify token expiration settings
# auth_token cookie has 7-day maxAge
```

#### CORS and Static Assets
**Issue**: Static CSS/JS files not loading
**Solution**:
```bash
# Verify static asset serving
# Check serveStatic middleware configuration
# Ensure static/styles.css exists after build
```

#### Database Migration Issues
**Issue**: Schema mismatches after updates
**Solution**:
```bash
# Generate new migration
bunx drizzle-kit generate

# Review generated SQL carefully
# Apply migration selectively if needed
bunx drizzle-kit migrate
```

**Section sources**
- [src/db/index.ts](file://src/db/index.ts#L5-L6)
- [src/index.tsx](file://src/index.tsx#L9-L9)
- [src/routes/api.tsx](file://src/routes/api.tsx#L336-L343)

## Conclusion
CreatorFlix provides a comprehensive foundation for building premium content streaming platforms. The setup process is straightforward with Bun as the primary runtime, and the modular architecture ensures maintainability and scalability. The combination of Hono, Drizzle ORM, and Tailwind CSS creates a robust development experience while maintaining performance and developer productivity.

Key advantages of the setup:
- **Fast Development**: Bun's native performance accelerates development cycles
- **Type Safety**: Drizzle ORM provides compile-time database safety
- **Modern Styling**: Tailwind CSS enables rapid UI development
- **Flexible Architecture**: Clear separation between public, admin, and API layers
- **Production Ready**: Well-structured codebase suitable for scaling

For production deployment, ensure proper environment variable management, database backup procedures, and monitoring setup. The modular design makes it easy to add new features while maintaining system stability.