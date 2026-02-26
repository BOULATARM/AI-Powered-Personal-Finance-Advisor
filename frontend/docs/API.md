# FinSight AI - API Documentation

## Backend Configuration

The frontend expects a Django backend running on `http://localhost:8001`

## Endpoints

### Authentication

#### Register
```
POST /api/auth/register/

Request:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response:
{
  "access": "jwt_token"
}
```

#### Login
```
POST /api/auth/login/

Request:
{
  "username": "string",
  "password": "string"
}

Response:
{
  "access": "jwt_token",
  "refresh": "refresh_token" (optional)
}
```

### Predictions

#### Get Savings Prediction
```
POST /api/predict/

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "Income": number,
  "Age": number,
  "Dependents": number,
  "Disposable_Income": number,
  "Desired_Savings": number,
  "Groceries": number,
  "Transport": number,
  "Eating_Out": number,
  "Entertainment": number,
  "Utilities": number,
  "Healthcare": number,
  "Education": number,
  "Miscellaneous": number,
  "Occupation": "Professional|Retired|Self_Employed|Student",
  "City_Tier": "Tier_1|Tier_2|Tier_3"
}

Response:
{
  "predicted_savings": number,
  "confidence": number (0-1),
  ... (additional fields from request)
}
```

### Chat

#### Send Message to AI
```
POST /api/chat/

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "message": "string",
  "context": "JSON string (optional)" // stringified prediction response
}

Response:
{
  "message": "string",
  "response": "string"
}

Error Response (503/502):
Chat service unavailable
```

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT access token
3. Frontend stores token in localStorage
4. Frontend sends token in Authorization header: `Bearer {token}`
5. All subsequent requests require valid token
6. On logout, token is removed from localStorage

## Error Handling

### Common Error Responses

```json
{
  "detail": "Error message",
  "message": "Error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `502` - Bad Gateway (chat service)
- `503` - Service Unavailable

## Frontend API Client

All API calls are made through `lib/api.ts`:

```typescript
// Authentication
import { register, login } from '@/lib/api'

// Predictions
import { predict } from '@/lib/api'

// Chat
import { sendChatMessage } from '@/lib/api'
```

## CORS Configuration

The backend should have CORS enabled to accept requests from:
- `http://localhost:3000` (development)
- Your production domain

## Rate Limiting (Recommended)

Consider implementing rate limiting on the backend:
- 10 predictions per minute per user
- 30 chat messages per minute per user
- 5 login attempts per minute per IP

## Security Best Practices

1. **Token Storage**: Tokens are stored in localStorage (consider using httpOnly cookies)
2. **HTTPS**: Always use HTTPS in production
3. **Password**: Passwords should be hashed with bcrypt or similar
4. **JWT Secret**: Keep JWT secret secure and rotate regularly
5. **Input Validation**: Validate all inputs on both frontend and backend
6. **CORS**: Configure CORS properly to only accept requests from your domain

## Testing

### Register User
```bash
curl -X POST http://localhost:8001/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Make Prediction
```bash
curl -X POST http://localhost:8001/api/predict/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Income": 50000,
    "Age": 30,
    "Dependents": 0,
    "Disposable_Income": 10000,
    "Desired_Savings": 5000,
    "Groceries": 300,
    "Transport": 200,
    "Eating_Out": 150,
    "Entertainment": 100,
    "Utilities": 150,
    "Healthcare": 100,
    "Education": 50,
    "Miscellaneous": 50,
    "Occupation": "Professional",
    "City_Tier": "Tier_1"
  }'
```

### Chat
```bash
curl -X POST http://localhost:8001/api/chat/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I save more money?"
  }'
```
