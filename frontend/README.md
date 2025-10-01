# Invoice Generator Frontend

React frontend for the Invoice Generator application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
VITE_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Build the project:
```bash
npm run build
```

4. Deploy:
```bash
netlify deploy --prod --dir=dist
```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Go to Netlify and create a new site

3. Connect your repository and select the `frontend` folder as the base directory

4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your backend URL (e.g., https://yourapp.ondigitalocean.app)

6. Deploy!

## Environment Variables

- `VITE_API_URL`: Backend API URL (required)

## Features

- Create and manage invoices and estimates
- Professional PDF generation
- Company branding with logo upload
- QR code support for payments
- Template system for reusable invoice formats
