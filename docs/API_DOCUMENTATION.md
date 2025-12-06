# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register New User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "phoneNumber": "+1234567890",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- Name: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Phone: Optional

---

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "phoneNumber": "+1234567890",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "phoneNumber": "+1234567890",
  "role": "user",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## User Endpoints

### Get All Users (Admin Only)
**GET** `/users`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ahmed Khan",
      "email": "ahmed@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get User By ID
**GET** `/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "phoneNumber": "+1234567890",
  "role": "user",
  "profilePicture": "",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Authorization:**
- Users can view their own profile
- Admins can view any profile

---

### Update User
**PUT** `/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Ahmed Ali Khan",
  "phoneNumber": "+9876543210",
  "profilePicture": "https://example.com/image.jpg"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Ali Khan",
  "email": "ahmed@example.com",
  "phoneNumber": "+9876543210",
  "profilePicture": "https://example.com/image.jpg"
}
```

**Updateable Fields:**
- name
- phoneNumber
- profilePicture

**Note:** Email and password cannot be updated through this endpoint

---

### Delete User (Admin Only)
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "User removed successfully"
}
```

---

## Health Check

### Check API Status
**GET** `/health`

**Response (200):**
```json
{
  "status": "OK",
  "message": "Islamic App API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "User already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details here"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production.

## CORS

CORS is enabled for all origins in development. Configure `ALLOWED_ORIGINS` in production.

---

## Testing with cURL

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed","email":"ahmed@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"password123"}'
```

### Get Current User:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. Import collection (coming soon)
2. Set environment variable `BASE_URL` to `http://localhost:5000/api`
3. After login, save token in environment variables
4. Use `{{TOKEN}}` in Authorization headers

---

For more information, see the main README.md
