# Invoice Generator Backend

Express.js backend API with MongoDB for the Invoice Generator application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

3. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Deployment to Digital Ocean App Platform

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Go to Digital Ocean App Platform and create a new app

3. Connect your repository and select the `backend` folder as the source

4. Configure environment variables in the App Platform dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URLS`: Comma-separated list of allowed frontend URLs (e.g., https://yourapp.netlify.app,https://preview.netlify.app)
   - `PORT`: Will be set automatically by Digital Ocean

5. Set the build and run commands:
   - Build Command: (leave empty)
   - Run Command: `npm start`

6. Deploy!

### Important: File Upload Storage

⚠️ **Ephemeral File System**: Digital Ocean App Platform has an ephemeral file system. Uploaded files (logos, QR codes) stored in `/uploads` will be **lost on redeploy or scaling**.

**Solutions:**
- **Recommended**: Migrate to object storage (Digital Ocean Spaces, AWS S3) for persistent file storage
- **Alternative**: Store images as base64 in MongoDB (not recommended for large files)
- **Temporary**: Use external URLs for logos and QR codes

Until object storage is implemented, inform users that uploads may be lost during deployments.

## API Endpoints

- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/upload/logo` - Upload logo
- `POST /api/upload/qrcode` - Upload QR code
