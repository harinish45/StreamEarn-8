# MongoDB Setup Guide for StreamEarn!8

## Overview
This guide provides complete setup and usage instructions for MongoDB integration in StreamEarn!8 application.

## 1. MongoDB Atlas Setup (via Vercel)

### Already Configured
- **Database Cluster**: atlas-pink-yacht
- **Plan**: Free Tier (M0)
- **Region**: US
- **Vercel Integration**: Connected through Vercel Storage

### Connection String
The connection string is automatically managed by Vercel and stored in the `.env` file:
```
MONGODB_URI=mongodb+srv://Vercel-Admin-atlas-pink-yacht:****@atlas-pink-yacht.wmugb4d.mongodb.net/?retryWrites=true&w=majority
```

## 2. Application Setup

### Environment Variables
Ensure these variables are in your `.env` file:

```bash
# MongoDB Connection (from Vercel)
MONGODB_URI=mongodb+srv://Vercel-Admin-atlas-pink-yacht:****@atlas-pink-yacht.wmugb4d.mongodb.net/?retryWrites=true&w=majority

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=****
```

### Required Dependencies
Ensure MongoDB driver is installed:
```bash
npm install mongodb
```

## 3. Database Connection Utility

### File: `src/lib/mongodb.ts`

Provides MongoDB connection pooling and management:

```typescript
import { connectToDatabase } from '@/lib/mongodb';

// Usage in your API routes or server functions
const { client, db } = await connectToDatabase();
const usersCollection = db.collection('users');
```

### Features
- ✅ Connection pooling (reuses connections)
- ✅ Automatic reconnection
- ✅ Error handling
- ✅ Database: streamEarn

## 4. API Endpoints

### A. Test MongoDB Connection

**Endpoint**: `GET /api/db-test`

**Purpose**: Verify MongoDB connection is working

**Usage**:
```bash
curl http://localhost:3000/api/db-test
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "MongoDB connection successful",
  "database": "streamEarn",
  "status": "connected",
  "timestamp": "2024-12-15T04:00:00.000Z"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "MongoDB connection failed",
  "error": "Connection timeout"
}
```

### B. Upload Files to Vercel Blob Storage

**Endpoint**: `POST /api/upload`

**Purpose**: Upload files to Vercel Blob Storage

**Usage**:
```javascript
const formData = new FormData();
formData.append('file', file); // File object from input

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.url); // Public URL to access file
```

**Response (Success)**:
```json
{
  "success": true,
  "url": "https://blob.vercelusercontent.com/uploads/1702631280000-document.pdf",
  "pathname": "uploads/1702631280000-document.pdf",
  "filename": "document.pdf",
  "size": 102400
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Upload failed - file size too large"
}
```

## 5. Database Schema

### Collections

#### users
```typescript
interface User {
  _id: ObjectId;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage?: string; // Blob URL
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
}
```

#### tasks
```typescript
interface Task {
  _id: ObjectId;
  title: string;
  description: string;
  category: string;
  reward: number;
  deadline: Date;
  creator: ObjectId; // Reference to users
  applicants: ObjectId[];
  status: 'open' | 'in-progress' | 'completed';
  proofRequired: boolean;
  proofUrl?: string; // Blob URL
  createdAt: Date;
  updatedAt: Date;
}
```

#### earnings
```typescript
interface Earning {
  _id: ObjectId;
  userId: ObjectId; // Reference to users
  taskId: ObjectId; // Reference to tasks
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  earnedAt: Date;
  approvedAt?: Date;
  paidAt?: Date;
}
```

## 6. Common Operations

### Insert a Document
```typescript
const { db } = await connectToDatabase();
const result = await db.collection('users').insertOne({
  email: 'user@example.com',
  username: 'username',
  createdAt: new Date(),
});
```

### Find Documents
```typescript
const { db } = await connectToDatabase();
const user = await db.collection('users').findOne({ email: 'user@example.com' });
const users = await db.collection('users').find({ verified: true }).toArray();
```

### Update a Document
```typescript
const { db } = await connectToDatabase();
await db.collection('users').updateOne(
  { _id: new ObjectId(userId) },
  { $set: { bio: 'New bio text' } }
);
```

### Delete a Document
```typescript
const { db } = await connectToDatabase();
await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
```

## 7. File Storage with Blob URLs

### Storing File References
```typescript
// After uploading file and getting blob URL
const { db } = await connectToDatabase();
await db.collection('users').updateOne(
  { _id: new ObjectId(userId) },
  { $set: { profileImage: 'https://blob.vercelusercontent.com/...' } }
);
```

### Retrieving Files
```typescript
const { db } = await connectToDatabase();
const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
const fileUrl = user.profileImage; // Use directly in <img src={fileUrl} />
```

## 8. Troubleshooting

### Connection Timeout
- Check MongoDB URI in .env
- Verify IP whitelist in MongoDB Atlas (should allow all IPs for Vercel)
- Check Vercel environment variables are synced

### Upload Fails
- Check file size (limit depends on Vercel plan)
- Verify BLOB_READ_WRITE_TOKEN is valid
- Check file type is allowed

### Slow Queries
- Add indexes on frequently queried fields
- Use connection pooling (already configured)
- Monitor usage in MongoDB Atlas console

## 9. Next Steps

1. ✅ Create MongoDB collections
2. ✅ Add indexes for better performance
3. ✅ Implement user authentication
4. ✅ Create task management features
5. ✅ Add file upload functionality
6. ✅ Set up earning tracking

## 10. Production Checklist

- [ ] Increase MongoDB cluster size from M0 (if needed)
- [ ] Enable automated backups
- [ ] Set up monitoring and alerts
- [ ] Configure IP whitelist properly for production
- [ ] Test all API endpoints
- [ ] Implement rate limiting
- [ ] Add proper error logging
- [ ] Set up SSL certificates
