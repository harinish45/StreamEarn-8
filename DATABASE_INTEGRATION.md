# StreamEarn!8 Database & Storage Integration

## Overview
This document outlines the database and storage configuration for StreamEarn!8 application.

## Connected Services

### 1. MongoDB Atlas (via Vercel)
- **Database**: atlas-pink-yacht
- **Plan**: Free Tier
- **Region**: US
- **Connection**: Through Vercel Storage integration
- **Environment Variable**: `MONGODB_URI`

### 2. Vercel Blob Storage
- **Store**: business-blob
- **Type**: Object Storage (Blob Store)
- **Access**: Public
- **Created**: Nov 27, 2024
- **Environment Variable**: `BLOB_READ_WRITE_TOKEN`

### 3. Firebase
- **Project**: StreamEarn!8
- **Services**: 
  - Authentication
  - Cloud Firestore
  - Cloud Storage
  - Hosting
- **Configuration**: Loaded from `.env` with `NEXT_PUBLIC_FIREBASE_*` variables

## Environment Variables

The following environment variables must be set:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://Vercel-Admin-atlas-pink-yacht:MQu3k1k3MdtxFQJn@atlas-pink-yacht.wmugb4d.mongodb.net/?retryWrites=true&w=majority

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=****

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

## Utility Files

### `src/lib/mongodb.ts`
Handles MongoDB connection with connection pooling:

```typescript
import { connectToDatabase } from '@/lib/mongodb';

const { client, db } = await connectToDatabase();
const collection = db.collection('users');
```

### `src/lib/blob.ts`
Handles Vercel Blob Storage operations:

```typescript
import { uploadFile, deleteFile, listFiles } from '@/lib/blob';

// Upload a file
const blob = await uploadFile(file, 'documents/my-file.pdf');

// Delete a file
await deleteFile(blob.url);

// List files
const files = await listFiles('documents/');
```

## Architecture

```
StreamEarn!8 (Next.js)
    |
    +-- Firebase Auth (User Authentication)
    |
    +-- MongoDB Atlas (Database via Vercel)
    |   - User data
    |   - Tasks
    |   - Earnings
    |   - Transactions
    |
    +-- Vercel Blob Storage (File Storage)
    |   - User documents
    |   - Proof of work
    |   - Images
    |
    +-- Firebase Firestore (Optional - Real-time data)
    |   - Live notifications
    |   - Real-time updates
```

## Database Collections

### MongoDB Collections
- `users` - User profiles and credentials
- `tasks` - Available tasks/opportunities
- `earnings` - User earnings records
- `transactions` - Payment transactions

## Usage Examples

### MongoDB Query
```typescript
const { db } = await connectToDatabase();
const user = await db.collection('users').findOne({ email: 'user@example.com' });
```

### Blob Upload
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
const { url } = await response.json();
```

## Security Notes

1. **MongoDB**: Connection string is stored securely in environment variables
2. **Blob Storage**: Tokens are server-side only, never exposed to client
3. **Firebase**: Uses public API keys for client-side authentication only
4. **CORS**: Vercel Blob Storage is configured for public access

## Deployment

When deploying to production:
1. Set all environment variables in Vercel project settings
2. Ensure MongoDB firewall allows Vercel IP ranges
3. Update Firebase rules for production security
4. Enable CORS on Blob Storage as needed

