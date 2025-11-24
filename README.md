# TinyLink - URL Shortener

A full-stack URL shortener application similar to bit.ly, built with Node.js, Express, Next.js, and PostgreSQL.

## Features

- **Create Short Links**: Shorten long URLs with optional custom codes (6-8 alphanumeric characters)
- **Redirect**: Automatic 302 redirects with click tracking
- **Dashboard**: View all links with search/filter functionality
- **Statistics**: Detailed stats for each link (clicks, last clicked time, etc.)
- **Delete Links**: Remove links with confirmation
- **Health Check**: System health endpoint for monitoring

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Next.js 14 (App Router) + React
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS

## Project Structure

```
/
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── db/          # Database connection
│   │   ├── middleware/  # Validation middleware
│   │   └── server.js    # Server entry point
│   └── package.json
├── frontend/            # Next.js app
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   ├── lib/             # API client
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Neon)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database URL:
```
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=3001
BASE_URL=http://localhost:3001
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will automatically create the database schema on first run.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /healthz` - Returns `{ ok: true, version: "1.0" }`

### Links API
- `POST /api/links` - Create a new short link
  - Body: `{ target_url: string, code?: string }`
  - Returns 409 if code already exists
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get stats for a specific link
- `DELETE /api/links/:code` - Delete a link

### Redirect
- `GET /:code` - Redirects to the target URL (302) and increments click count
- Returns 404 if code doesn't exist

## Code Format

- Short codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- If no custom code is provided, a random code is auto-generated
- Codes are globally unique

## Deployment

### Backend (Render/Railway)

1. Connect your repository
2. Set environment variables:
   - `DATABASE_URL`
   - `PORT` (usually auto-set)
   - `BASE_URL` (your backend URL)
3. Set build command: `npm install`
4. Set start command: `npm start`

### Frontend (Vercel)

1. Connect your repository
2. Set root directory to `frontend`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (your backend URL)
   - `NEXT_PUBLIC_BASE_URL` (your frontend URL)
4. Deploy

### Database (Neon)

1. Create a new Neon project
2. Copy the connection string
3. Use it as `DATABASE_URL` in your backend environment variables

## Testing

The application follows specific URL conventions for automated testing:

- `/` - Dashboard
- `/code/:code` - Stats page
- `/:code` - Redirect (302 or 404)
- `/healthz` - Health check (returns 200)

## License

ISC

