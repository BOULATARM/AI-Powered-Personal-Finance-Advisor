const API_BASE = 'http://127.0.0.1:8001'

// =========================
// TYPES
// =========================

export interface AuthResponse {
  access: string
  refresh?: string
}

export interface UserData {
  id: number
  username: string
  email: string
}

export type PredictionPayload = {
  Income: number
  Age: number
  Dependents: number
  Disposable_Income: number
  Desired_Savings: number
  Groceries: number
  Transport: number
  Eating_Out: number
  Entertainment: number
  Utilities: number
  Healthcare: number
  Education: number
  Miscellaneous: number
  Occupation: 'Professional' | 'Retired' | 'Self_Employed' | 'Student'
  City_Tier: 'Tier_1' | 'Tier_2' | 'Tier_3'
}

export type PredictionResponse = {
  Potential_Savings_Groceries: number
  Potential_Savings_Transport: number
  Potential_Savings_Eating_Out: number
  Potential_Savings_Entertainment: number
  Potential_Savings_Utilities: number
  Potential_Savings_Healthcare: number
  Potential_Savings_Education: number
  Potential_Savings_Miscellaneous: number
  Total_Potential_Savings: number
}

// =========================
// AUTH
// =========================

export async function register(
  username: string,
  email: string,
  password: string
): Promise<UserData> {
  const response = await fetch(`${API_BASE}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || 'Registration failed')
  }

  return data
}

export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || 'Login failed')
  }

  return data
}

// =========================
// PREDICTION
// =========================

export async function predict(
  payload: PredictionPayload,
  token: string
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/api/predict/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error('Predict error:', res.status, data)
    throw new Error(data?.error || data?.detail || 'Prediction failed')
  }

  return data as PredictionResponse
}

// =========================
// CHAT
// =========================

export async function sendChatMessage(
  message: string,
  token: string,
  context?: PredictionResponse,
  conversation_id?: string
): Promise<{ conversation_id: string; reply: string }> {
  const res = await fetch(`${API_BASE}/api/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      context,
      conversation_id,
    }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.error || data?.detail || 'Chat failed')
  }

  return data
}
