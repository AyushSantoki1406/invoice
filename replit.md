# Invoice Generator Application

## Overview

This is a full-stack invoice generator application built with React, TypeScript, and Express.js. The application allows users to create professional invoices with company branding, client information, itemized billing, and payment details including QR codes for UPI payments.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Amount Input & Quantity Multiplication Fix
- Fixed amount typing issues with decimal numbers (e.g., 99.50)
- Implemented proper quantity multiplication: when quantity is 2, total amount doubles
- Updated calculation logic to handle direct amount entry with quantity multipliers
- Fixed preview and PDF to show quantity × amount = total line amount

### PDF Generation Improvements
- Enhanced professional appearance with better styling
- Fixed currency formatting using Indian number formatting (₹1,50,000.00)
- Improved table headers with blue background and white text
- Better typography with bold fonts for headers and company name
- Removed formatting issues that caused extra characters in amounts

### Document Type System & Bank Details Conditional Display
- Added document type selector with "Invoice" and "Estimate" options
- Implemented conditional display of bank details (only shown for invoices, not estimates)
- Updated form, preview, and PDF generation to respect document type requirements
- Added bank account holder name field to payment details section
- Created separate home page with navigation to both invoice and estimate creators
- Enhanced user experience with appropriate labels and functionality based on document type

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints for invoices and templates
- **File Handling**: Multer for logo uploads with local storage
- **Development**: Hot reload with Vite integration in development mode

## Key Components

### Data Models
- **Invoices**: Complete invoice records with company info, client details, line items, and payment information
- **Invoice Templates**: Reusable templates for quick invoice creation
- **Invoice Items**: Individual line items with description, quantity, rate, and calculated amounts

### Core Features
- **Invoice Creation**: Form-driven invoice creation with real-time preview
- **PDF Generation**: Client-side PDF generation using jsPDF
- **QR Code Generation**: UPI payment QR codes for Indian market
- **Template System**: Save and reuse invoice templates
- **File Upload**: Company logo upload with image validation
- **Responsive Design**: Mobile-first responsive interface

### UI Components
- **Invoice Form**: Multi-section form with validation and real-time calculations
- **Invoice Preview**: Live preview that updates as form changes
- **File Upload**: Drag-and-drop file upload component
- **Form Controls**: Comprehensive set of form inputs using Radix UI primitives

## Data Flow

### Invoice Creation Flow
1. User fills out invoice form with company and client information
2. Form data is validated client-side using Zod schemas
3. Real-time calculations update subtotal, tax, and total amounts
4. Live preview shows formatted invoice as user types
5. Invoice data is sent to backend API for persistence
6. PDF can be generated client-side for download

### Template Management
1. Users can save current invoice data as a template
2. Templates are stored with user-defined names
3. Saved templates can be loaded to pre-populate new invoices
4. Templates include all invoice fields except invoice number and dates

### File Upload Process
1. Logo files are uploaded via drag-and-drop or file picker
2. Client-side validation ensures image format and size limits
3. Files are stored locally on server with unique filenames
4. File URLs are returned and stored with invoice data

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **Build Tools**: Vite, TypeScript, ESBuild for production builds
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon serverless database
- **UI Framework**: Radix UI primitives, Tailwind CSS, class-variance-authority

### Utility Libraries
- **Validation**: Zod for runtime type checking and form validation
- **Date Handling**: date-fns for date formatting and manipulation
- **PDF Generation**: jsPDF for client-side PDF creation
- **QR Codes**: qrcode library for generating payment QR codes
- **File Upload**: Multer for handling multipart file uploads

### Development Tools
- **Hot Reload**: Vite with custom middleware integration
- **Error Handling**: Runtime error overlay for development
- **Code Quality**: TypeScript with strict mode enabled

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public` directory
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes
- **Assets**: Static files served from build output directory

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable
- **File Storage**: Local file system with configurable upload directory
- **Development**: NODE_ENV-based configuration switching
- **Production**: Optimized builds with tree shaking and minification

### Deployment Requirements
- Node.js runtime environment
- PostgreSQL database (Neon Database recommended)
- File system access for uploaded logos
- Environment variables for database connection

The application follows a monorepo structure with shared TypeScript schemas and clear separation between client and server code, making it maintainable and scalable for future enhancements.