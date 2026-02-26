# FinSight AI - Manual Testing Guide

## Pre-Testing Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Django backend running on `http://localhost:8001`
- [ ] All dependencies installed (`pnpm install`)

## Test Scenarios

### 1. Authentication Flow

#### Test 1.1: User Registration
1. Start the app: `pnpm dev`
2. Navigate to `http://localhost:3000`
3. Should redirect to `/(auth)` (login page)
4. Click "Register" tab
5. Fill in:
   - Username: `testuser123`
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
6. Click "Create Account"
7. **Expected**: Should create account and redirect to `/dashboard`

#### Test 1.2: User Login
1. Logout (click logout button in dashboard header)
2. You should be back at `/(auth)` login page
3. Fill in:
   - Username: `testuser123`
   - Password: `TestPassword123!`
4. Click "Sign In"
5. **Expected**: Should login and redirect to `/dashboard`

#### Test 1.3: Invalid Credentials
1. Enter wrong password for existing user
2. Click "Sign In"
3. **Expected**: Error message appears: "Login failed"

#### Test 1.4: Registration with Mismatched Passwords
1. Click "Register" tab
2. Enter different passwords in password fields
3. Click "Create Account"
4. **Expected**: Error message: "Passwords do not match"

#### Test 1.5: Token Storage
1. Login successfully
2. Open browser DevTools → Application → Local Storage
3. **Expected**: Should see `finsight_token` key with JWT value

### 2. Dashboard Form Tests

#### Test 2.1: Form Field Validation
1. Dashboard should load with pre-filled form values
2. **Expected fields visible**:
   - Income: 50000
   - Age: 30
   - Dependents: 0
   - Disposable Income: 10000
   - Desired Savings: 5000
   - 8 expense fields (Groceries, Transport, etc.)
   - Occupation dropdown (default: Professional)
   - City Tier dropdown (default: Tier_1)

#### Test 2.2: Form Input Types
1. Try entering non-numeric values in number fields
2. **Expected**: Input should only accept numbers

#### Test 2.3: Form Dropdown Changes
1. Change Occupation dropdown to "Retired"
2. Change City Tier to "Tier_2"
3. **Expected**: Dropdowns update without errors

#### Test 2.4: Submit Form (Get Prediction)
1. Keep default values or customize as desired
2. Click "Get Prediction" button
3. **Expected**:
   - Loading spinner appears
   - Results appear in right panel after 1-5 seconds
   - Button becomes disabled while loading

### 3. Prediction Results Tests

#### Test 3.1: Results Display
After successful prediction, verify:
1. **KPI Cards**:
   - Predicted Savings card with amount
   - Confidence percentage (should be 0-100%)
   - Both cards have proper styling

2. **Pie Chart**:
   - Shows expense breakdown
   - Labels show category names and amounts
   - Hover shows tooltip

3. **Bar Chart**:
   - Compares Desired vs Predicted savings
   - X-axis shows amounts
   - Y-axis shows categories

4. **Profile Cards**:
   - Shows 6 cards: Income, Disposable, Age, Dependents, Occupation, City Tier
   - All values match form input

#### Test 3.2: Responsive Design
1. Open DevTools → Toggle device toolbar
2. Test on mobile (375px), tablet (768px), desktop (1024px)
3. **Expected**:
   - Mobile: Form on left, results on right stack vertically
   - Tablet: Layout adjusts appropriately
   - Desktop: Side-by-side layout

#### Test 3.3: Chart Interactivity
1. Hover over pie chart segments
2. **Expected**: Tooltip appears with category name and amount

### 4. Chatbot Tests

#### Test 4.1: Chatbot Widget Visibility
1. After getting predictions, scroll down
2. Look for floating button (bottom-right corner)
3. **Expected**: Round button with chat icon visible

#### Test 4.2: Open Chatbot
1. Click "Ask AI for Financial Advice" button on results
   OR click floating chat button
2. **Expected**: Chat widget opens as modal popup

#### Test 4.3: Send Message
1. Type: "How can I save more money?"
2. Press Enter or click Send button
3. **Expected**:
   - User message appears on right side
   - Loading indicator appears
   - Bot response appears on left side after 1-3 seconds

#### Test 4.4: Message History
1. Send another message: "What should I prioritize?"
2. **Expected**: Previous messages remain visible above

#### Test 4.5: Chat with Context
1. Check that chatbot has access to your prediction data
2. Ask: "Based on my profile, what are my spending patterns?"
3. **Expected**: Bot response references your financial data

#### Test 4.6: Close Chatbot
1. Click X button in top-right of chat widget
2. **Expected**: Chat widget closes, floating button visible

#### Test 4.7: Chat Service Unavailable (502 Error)
1. Stop the backend temporarily
2. Try to send a message
3. **Expected**: Error message: "Chat service unavailable. Please try again later."

### 5. Error Handling Tests

#### Test 5.1: Network Error
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to submit prediction
4. **Expected**: Error message appears

#### Test 5.2: Logout and Protected Route
1. In dashboard, open DevTools → Application → Local Storage
2. Delete the `finsight_token` key manually
3. Refresh page
4. **Expected**: Redirected to `/(auth)` login page

#### Test 5.3: Invalid Token
1. Edit token in Local Storage to invalid value
2. Refresh page
3. Try to get prediction
4. **Expected**: Error message appears

### 6. UI/UX Tests

#### Test 6.1: Dark Mode
1. App should be in dark mode by default
2. Background should be very dark (#0F172A)
3. Text should be light/white
4. **Expected**: Readable contrast throughout

#### Test 6.2: Button Hover States
1. Hover over "Get Prediction" button
2. Hover over "Ask AI for Financial Advice" button
3. **Expected**: Buttons change color on hover with smooth transition

#### Test 6.3: Loading States
1. Submit prediction form
2. While loading, observe button
3. **Expected**: Button shows spinner and "Predicting..." text

#### Test 6.4: Animations
1. Login and navigate to dashboard
2. Observe transitions and animations
3. **Expected**: Smooth, not jarring

#### Test 6.5: Form Focus States
1. Click on input fields
2. **Expected**: Fields show focus ring (cyan border)

### 7. Cross-Browser Tests

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

For each browser:
1. Registration flow
2. Login flow
3. Prediction form
4. Results display
5. Chatbot functionality

### 8. Mobile/Responsive Tests

#### Test on Mobile Devices or DevTools
- [ ] iPhone 12 (390x844)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] iPad (768x1024)

For each device:
1. Form should be scrollable
2. Results should display correctly
3. Chatbot should be accessible
4. All buttons should be tap-friendly (44px minimum)

### 9. Performance Tests

#### Test 9.1: Page Load
1. Open DevTools → Performance tab
2. Load `/dashboard`
3. **Expected**: Initial load < 3 seconds

#### Test 9.2: Form Submission
1. Open DevTools → Network tab
2. Submit prediction
3. **Expected**: Request completes in < 5 seconds

#### Test 9.3: Chat Response
1. Send chat message
2. **Expected**: Response within 3-5 seconds

## Test Data Sets

### Test User 1: High Income, Low Expenses
```
Income: 100000
Age: 35
Dependents: 0
Disposable Income: 50000
Desired Savings: 20000
Expenses: All low (100-200)
Occupation: Professional
City Tier: Tier_1
```
Expected: High predicted savings

### Test User 2: Low Income, High Expenses
```
Income: 25000
Age: 25
Dependents: 2
Disposable Income: 5000
Desired Savings: 2000
Expenses: All high (400-500)
Occupation: Student
City Tier: Tier_3
```
Expected: Low/negative predicted savings

### Test User 3: Balanced Profile
```
Income: 60000
Age: 40
Dependents: 1
Disposable Income: 15000
Desired Savings: 8000
Expenses: Moderate (200-300)
Occupation: Self_Employed
City Tier: Tier_2
```
Expected: Moderate predicted savings

## Bug Report Template

If you find issues, document:

```
**Title**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Error Message** (if any):
[Copy exact error]

**Browser/Device**:
[Chrome v123, iPhone 12, etc.]

**Screenshot**:
[If applicable]
```

## Success Criteria

Application is ready when:
- [ ] All auth tests pass
- [ ] All form tests pass
- [ ] All results visualization tests pass
- [ ] Chatbot functionality works
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors
- [ ] Load times acceptable
- [ ] All error cases handled gracefully

## Notes

- Backend must be running on `http://localhost:8001`
- Clear browser cache if seeing old versions
- Check backend logs for API errors
- Use DevTools to inspect network requests
