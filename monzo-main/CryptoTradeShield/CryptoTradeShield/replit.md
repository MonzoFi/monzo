# replit.md

## Overview

This is "Monzo" - a premium cryptocurrency exchange platform built as a full-stack web application. The system enables users to swap cryptocurrencies, engage in escrow trading, and monitor market data in real-time. It features a modern React frontend with animated orange-themed backgrounds, a Node.js/Express backend, PostgreSQL database integration using Drizzle ORM, and Replit authentication for user management. The platform includes separate client and admin interfaces with comprehensive fake transaction displays.

## System Architecture

The application follows a monorepo structure with clear separation between client and server components:

- **Frontend**: React-based SPA using Vite for build tooling and development server
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit's OIDC-based authentication system
- **UI Framework**: shadcn/ui components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components organized by feature
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom crypto-themed design system
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library with Radix UI primitives

### Backend Architecture
- **API Design**: RESTful endpoints organized by feature domains
- **Database Layer**: Drizzle ORM with connection pooling via Neon serverless
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Passport.js with OpenID Connect strategy
- **Service Layer**: Dedicated services for crypto operations and escrow management

### Database Schema
- **Users**: Core user data with KYC status and profile information
- **Cryptocurrencies**: Supported digital assets with network details
- **Transactions**: Swap transactions, INR transactions, and escrow trades
- **Market Data**: Real-time pricing and trading volume data
- **Sessions**: Secure session storage for authentication

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit OIDC, sessions stored in PostgreSQL
2. **Market Data**: Real-time cryptocurrency prices fetched from external APIs (CoinGecko)
3. **Trading Operations**: Swap transactions processed through dedicated service layer
4. **Escrow System**: Multi-party trades managed with confirmation workflows
5. **API Communication**: Frontend communicates with backend via REST APIs using TanStack Query

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL connection management
- **Replit Auth**: OIDC authentication provider
- **CoinGecko API**: Market data and pricing information
- **shadcn/ui**: Pre-built accessible UI components
- **Drizzle ORM**: Type-safe database operations
- **TanStack Query**: Server state management and caching

## Deployment Strategy

The application is configured for deployment on Replit's infrastructure:

- **Development**: Vite dev server with hot module replacement
- **Production**: Vite build process generates optimized client bundle
- **Server**: esbuild bundles server code for production deployment
- **Database**: Neon serverless PostgreSQL for scalable data storage
- **Environment**: Node.js 20 runtime with PostgreSQL 16 module

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 26, 2025: Complete platform rebranding to "Monzo" with orange color theme
- June 26, 2025: Implemented animated background with gradient shifts and floating particles
- June 26, 2025: Created separate admin interface at /admin route with transaction management
- June 26, 2025: Added RecentTransactions component displaying fake transaction data for demo
- June 26, 2025: Updated all UI components to use Monzo orange branding (buttons, cards, gradients)
- June 26, 2025: Integrated Monzo logo throughout navigation and landing page

## Changelog

Changelog:
- June 26, 2025. Initial setup and complete Monzo rebranding