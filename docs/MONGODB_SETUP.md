# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for the Musafir Islamic App.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in

## Step 2: Create a New Cluster

1. Click "Build a Cluster"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "Cluster0")
5. Click "Create Cluster" (this may take a few minutes)

## Step 3: Create Database User

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and password (save these!)
5. Set User Privileges to "Atlas Admin"
6. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IP addresses
4. Click "Confirm"

## Step 5: Get Connection String

1. Click "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```

## Step 6: Configure Backend

1. Navigate to `backend/` folder
2. Copy `.env.example` to `.env`
3. Replace the placeholders in the connection string:
   - `<username>`: Your database username
   - `<password>`: Your database password
   - `<database-name>`: Your database name (e.g., "musafir")

Example:
```env
MONGODB_URI=mongodb+srv://musafir_admin:MySecurePassword123@cluster0.abc123.mongodb.net/musafir?retryWrites=true&w=majority
```

## Step 7: Test Connection

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. You should see: "✅ Connected to MongoDB Atlas"

## Database Collections

The app will automatically create these collections:
- `users` - User accounts and profiles

## Tips

- **Security**: Never commit your `.env` file to Git
- **Backup**: MongoDB Atlas provides automatic backups
- **Monitoring**: Use MongoDB Atlas dashboard to monitor database performance
- **Free Tier Limits**: 512 MB storage, shared RAM

## Troubleshooting

**Connection Timeout Error**:
- Check if your IP address is whitelisted in Network Access
- Verify your username and password are correct

**Authentication Failed**:
- Ensure you're using the database user credentials (not your Atlas account)
- Check that special characters in password are URL-encoded

**Database Not Found**:
- MongoDB will create the database automatically on first write operation
- Make sure you replaced `<database-name>` in the connection string
