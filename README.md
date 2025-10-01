# Invoice Generator - Full Stack Application

A professional invoice and estimate generator with separate frontend and backend deployments.

## Project Structure

```
├── backend/          # Express.js API with MongoDB
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── config/      # Database configuration
│   │   └── server.js    # Main server file
│   └── package.json
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and types
│   │   └── hooks/       # Custom hooks
│   └── package.json
```

## Getting Started

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Create `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

3. Start server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173

## Deployment

### Backend - Digital Ocean App Platform

See [backend/README.md](backend/README.md) for detailed deployment instructions.

### Frontend - Netlify

See [frontend/README.md](frontend/README.md) for detailed deployment instructions.

## Features

- ✅ Create professional invoices and estimates
- ✅ Company branding with logo upload
- ✅ QR code payment support
- ✅ PDF generation
- ✅ Template system for reusable formats
- ✅ MongoDB database for persistent storage
- ✅ Separate deployments for frontend and backend

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads
