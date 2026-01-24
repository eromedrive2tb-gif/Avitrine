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
- [src/services/auth.ts](file://src/services/auth.ts)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [System Requirements](#system-requirements)
4. [Environment Setup](#environment-setup)
5. [Installation Steps](#installation-steps)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [CSS Generation](#css-generation)
9. [Project Startup](#project-startup)
10. [Initial Project Structure Walkthrough](#initial-project-structure-walkthrough)
11. [Verification Steps](#verification-steps)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Conclusion](#conclusion)

## Introduction
CreatorFlix is a premium content streaming platform built with Atomic Design principles. It combines modern frontend development with a backend runtime optimized for speed and simplicity. This guide walks you through setting up the project locally, configuring dependencies, connecting to a database, generating styles, and launching the application.

## Prerequisites
- Operating system: macOS, Linux, or Windows with WSL
- Runtime: Bun (v1.x recommended)
- Database: PostgreSQL (local or remote)
- Build tooling: Tailwind CLI for CSS generation
- Optional: AWS S3-compatible storage credentials for media assets

**Section sources**
- [README.md](file://README.md#L1-L49)
- [package.json](file://package.json#L1-L23)

## System Requirements
- CPU: Modern x64 processor
- RAM: Minimum 4 GB, recommended 8 GB+
- Disk: ~500 MB free space for dependencies and build artifacts
- Network: Internet connection for downloading dependencies and accessing external APIs (e.g., JunglePay webhooks)
- Browser: Latest Chrome, Firefox, or Edge for local testing

**Section sources**
- [README.md](file://README.md#L1-L49)

## Environment Setup
Install Bun globally if not already installed. Bun is the runtime and package manager used by the project.

- Download and install Bun from https://bun.sh
- Verify installation by running:
  - bun --version

Once Bun is installed, proceed to install project dependencies.

**Section sources**
- [README.md](file://README.md#L13-L18)
- [package.json](file://package.json#L3-L7)

## Installation Steps
Follow these steps to install and prepare the project:

1) Install dependencies
- Run the Bun installer to fetch all dependencies defined in the project manifest.

2) Generate CSS
- Build Tailwind CSS output from the input stylesheet.

3) Start the development server
- Launch the application in hot-reload mode for rapid iteration.

These commands are documented in the project’s setup instructions.

**Section sources**
- [README.md](file://README.md#L13-L37)
- [package.json](file://package.json#L3-L7)

## Environment Variables
Configure the following environment variables depending on your deployment target:

- DATABASE_URL
  - Purpose: Connection string for PostgreSQL database
  - Location: Used by the database client initialization
  - Default fallback: A local or remote PostgreSQL endpoint is used if unset

- JWT_SECRET
  - Purpose: Secret key for signing and verifying JWT tokens
  - Location: Used in public and API routes for authentication-related flows

- NODE_ENV (optional)
  - Purpose: Controls cookie security behavior (secure flag)
  - Location: Applied when setting cookies in authentication flows

Notes:
- For local development, you can set these variables in your shell session or a .env file if supported by your environment.
- The application reads these variables at runtime; ensure they are present before starting the server.

**Section sources**
- [src/db/index.ts](file://src/db/index.ts#L5-L7)
- [src/routes/public.tsx](file://src/routes/public.tsx#L18-L28)
- [src/routes/api.tsx](file://src/routes/api.tsx#L13-L13)
- [src/routes/api.tsx](file://src/routes/api.tsx#L336-L343)
- [src/routes/api.tsx](file://src/routes/api.tsx#L508-L516)

## Database Setup
CreatorFlix uses PostgreSQL with Drizzle ORM for data modeling and migrations.

High-level steps:
- Provision a PostgreSQL database (local or managed)
- Set DATABASE_URL to point to your database
- Optionally generate and apply migrations using Drizzle Kit
- Alternatively, rely on the schema defined in code for quick iteration

Schema overview:
- Users, Plans, Subscriptions, Models, Posts, Admin Settings, Whitelabel Models/Posts/Media, Support Contacts, Checkouts, and Payment Gateways
- Relations between entities are defined in the schema module

Initialization behavior:
- On first load, admin routes may seed default plans and payment gateways if missing
- Public routes consume the schema to render pages and handle authentication

Optional migration workflow:
- Generate migration files from the schema
- Apply migrations to the database

**Section sources**
- [README.md](file://README.md#L20-L27)
- [drizzle.config.ts](file://drizzle.config.ts#L1-L11)
- [src/db/index.ts](file://src/db/index.ts#L1-L8)
- [src/db/schema.ts](file://src/db/schema.ts#L1-L178)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L22-L48)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L50-L65)

## CSS Generation
Tailwind CSS v4 is used for styling. The build pipeline compiles the input stylesheet into a single output file for production.

Build commands:
- Build CSS once
- Watch CSS for changes during development

Content scanning:
- Tailwind scans React components and other supported files under the src directory to include only used styles

Theme customization:
- Colors, fonts, gradients, shadows, and animations are configured centrally

**Section sources**
- [README.md](file://README.md#L29-L32)
- [package.json](file://package.json#L5-L6)
- [tailwind.config.js](file://tailwind.config.js#L1-L39)

## Project Startup
Start the development server using Bun with hot reload enabled.

- Command: bun run dev
- Port: 3000
- Static assets: served from the static directory

Endpoints:
- Public routes: home, models, posts, plans, checkout, login/register
- Admin routes: dashboard, models, ads, plans, finance, settings, whitelabel, support
- API routes: authentication, checkout, webhooks, admin operations

**Section sources**
- [README.md](file://README.md#L34-L41)
- [package.json](file://package.json#L4-L4)
- [src/index.tsx](file://src/index.tsx#L16-L20)
- [src/index.tsx](file://src/index.tsx#L9-L14)
- [src/routes/public.tsx](file://src/routes/public.tsx#L54-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L18-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L15-L519)

## Initial Project Structure Walkthrough
This section introduces the Atomic Design–organized frontend and backend routing:

- Atoms: smallest reusable UI elements (buttons, inputs, icons)
- Molecules: combinations of atoms (cards, forms)
- Organisms: complex sections (navigation bars, carousels)
- Templates: page layouts
- Pages: route-mounted views

Routing overview:
- Public routes: homepage, models, posts, plans, checkout, auth
- Admin routes: internal management UI
- API routes: authentication, checkout, webhooks, admin operations

Services:
- Authentication service handles registration, login, and subscription checks
- Whitelabel service orchestrates model and post queries and synchronization

**Section sources**
- [README.md](file://README.md#L43-L49)
- [src/routes/public.tsx](file://src/routes/public.tsx#L1-L170)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L1-L158)
- [src/routes/api.tsx](file://src/routes/api.tsx#L1-L519)
- [src/services/auth.ts](file://src/services/auth.ts#L1-L91)
- [src/services/whitelabel.ts](file://src/services/whitelabel.ts#L1-L24)

## Verification Steps
After completing setup, verify the installation with these checks:

- Dependencies installed
  - Confirm all packages listed in the manifest are present
- Database connectivity
  - Ensure DATABASE_URL is valid and reachable
  - Test schema availability and basic queries
- CSS generated
  - Verify static/styles.css exists after building
- Application starts
  - Access http://localhost:3000 for the public site
  - Access http://localhost:3000/admin for the admin panel
- Authentication flow
  - Register a user and log in to confirm JWT cookie behavior
- Admin initialization
  - Visit admin routes to trigger seeding of default plans and gateways if needed

**Section sources**
- [README.md](file://README.md#L13-L41)
- [src/db/index.ts](file://src/db/index.ts#L5-L7)
- [package.json](file://package.json#L5-L6)
- [src/index.tsx](file://src/index.tsx#L16-L20)
- [src/routes/public.tsx](file://src/routes/public.tsx#L18-L28)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L22-L48)

## Troubleshooting Guide
Common setup issues and resolutions:

- Bun fails to install dependencies
  - Clear cache and retry installation
  - Ensure network connectivity and correct Bun version

- Tailwind build errors
  - Verify Tailwind CLI is available
  - Check that the input stylesheet path matches the configured entry

- Database connection failures
  - Validate DATABASE_URL format and credentials
  - Confirm the database server is reachable from your machine

- Hot reload not working
  - Ensure the dev script is executed with Bun
  - Check for syntax errors in TypeScript/JSX files

- Admin routes not seeding defaults
  - Manually insert required plans and gateways if auto-seeding does not occur
  - Confirm database permissions allow inserts

- Authentication cookies not set
  - Ensure JWT_SECRET is configured
  - Check cookie security flags in production vs development environments

**Section sources**
- [README.md](file://README.md#L13-L41)
- [package.json](file://package.json#L3-L7)
- [src/db/index.ts](file://src/db/index.ts#L5-L7)
- [src/routes/public.tsx](file://src/routes/public.tsx#L18-L28)
- [src/routes/admin.tsx](file://src/routes/admin.tsx#L22-L48)
- [src/routes/api.tsx](file://src/routes/api.tsx#L336-L343)
- [src/routes/api.tsx](file://src/routes/api.tsx#L508-L516)

## Conclusion
You are now ready to develop and run CreatorFlix locally. Use the steps above to install dependencies, configure the database, generate styles, and launch the application. Refer to the troubleshooting section if you encounter issues. As you become more familiar with the codebase, explore the Atomic Design–organized components and the routing structure to extend functionality confidently.