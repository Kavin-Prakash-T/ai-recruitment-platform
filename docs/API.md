# HireFlow AI - Authentication API Documentation

This document describes the API endpoints, authentication cookie behavior, user roles, routing protection, and response/status code formats implemented in the Authentication module.

---

## 1. General Specifications

### Base URL
All authentication endpoints are prefixed with:
`/api/auth`

### Supported Roles
The platform defines 5 distinct user roles:
- `CANDIDATE`: Applying for jobs, tracking application process.
- `RECRUITER`: Managing jobs and reviewing candidates.
- `HIRING_MANAGER`: Reviewing pipelines and making hiring decisions.
- `INTERVIEWER`: Providing interview scorecards and reviews.
- `ADMIN`: Global administration, auditing, and platform control.

### Authentication Cookie Behavior
- The authentication token is stored inside an HTTP-only cookie named `token`.
- **Security features**:
  - `httpOnly: true` (prevents JavaScript access to protect against XSS).
  - `secure: true` (only sent over HTTPS, enabled dynamically in `production` mode).
  - `sameSite: 'lax'` (or `sameSite: 'none'` in production) to restrict cross-site sharing.
  - Expire duration: 24 hours (`1d`).

### Expected Response Format

#### Success Format
```json
{
  "success": true,
  "message": "Operation successful description",
  "data": { ... }
}
```

#### Error Format
```json
{
  "success": false,
  "message": "Error description text"
}
```

---

## 2. API Endpoint Catalog

### POST /api/auth/register
Registers a new user on the platform.

- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Authentication**: None required
- **Required Role**: None
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "CANDIDATE"
  }
  ```
- **Validation Rules**:
  - `name`: Must be trimmed and not empty.
  - `email`: Must be a valid email string. It is normalized (lowercase & trimmed) before matching.
  - `password`: Minimum length of 6. Must contain at least one letter and one number.
  - `role`: Must match one of: `CANDIDATE`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`, `ADMIN`.
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "64e0a78b54b2a3a5f061298c",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "CANDIDATE",
        "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe",
        "isEmailVerified": false,
        "isActive": true,
        "createdAt": "2026-08-10T16:00:00.000Z",
        "updatedAt": "2026-08-10T16:00:00.000Z"
      }
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request` (Validation error / email format / short password / duplicate email):
    ```json
    {
      "success": false,
      "message": "Email is already registered"
    }
    ```

---

### POST /api/auth/login
Authenticates a user and sets the JWT in the HTTP-only cookie.

- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Authentication**: None required
- **Required Role**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (200 OK)**:
  *(Also sets a `Set-Cookie: token=<jwt>; HttpOnly; ...` header)*
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "64e0a78b54b2a3a5f061298c",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "CANDIDATE",
        "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe",
        "isEmailVerified": false,
        "isActive": true,
        "createdAt": "2026-08-10T16:00:00.000Z",
        "updatedAt": "2026-08-10T16:00:00.000Z"
      }
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request` (Missing fields / invalid email format)
  - `401 Unauthorized` (Incorrect email or password):
    ```json
    {
      "success": false,
      "message": "Invalid email or password"
    }
    ```
  - `403 Forbidden` (Inactive user profile):
    ```json
    {
      "success": false,
      "message": "User account is inactive. Please contact support."
    }
    ```

---

### POST /api/auth/logout
Clears the authentication token cookie, ending the session.

- **Method**: `POST`
- **URL**: `/api/auth/logout`
- **Authentication**: Yes (JWT `token` cookie must be present and valid)
- **Required Role**: None
- **Request Body**: None (Empty)
- **Success Response (200 OK)**:
  *(Clears the `token` cookie)*
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized` (Session cookie is missing / expired / invalid):
    ```json
    {
      "success": false,
      "message": "Not authorized, token missing"
    }
    ```

---

### GET /api/auth/me
Fetches current logged-in user profile attributes.

- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Authentication**: Yes (JWT `token` cookie must be present and valid)
- **Required Role**: None
- **Request Body**: None (Empty)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "64e0a78b54b2a3a5f061298c",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "CANDIDATE",
        "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe",
        "isEmailVerified": false,
        "isActive": true,
        "createdAt": "2026-08-10T16:00:00.000Z",
        "updatedAt": "2026-08-10T16:00:00.000Z"
      }
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized` (Token cookie missing / expired / invalid / user inactive / deleted):
    ```json
    {
      "success": false,
      "message": "Not authorized, token expired"
    }
    ```

---

## 3. Role Authorization Middleware Example

To protect specific routes, use the curried helper `requireRole`:
```typescript
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

// Reusable middleware
router.post('/jobs', protect, requireRole('RECRUITER', 'ADMIN'), createJobController);
```
On unauthorized access (e.g. CANDIDATE tries to access RECRUITER route), the API yields:
- **Status code**: `403 Forbidden`
- **Body**:
  ```json
  {
    "success": false,
    "message": "Forbidden, you do not have permission to access this resource"
  }
  ```
