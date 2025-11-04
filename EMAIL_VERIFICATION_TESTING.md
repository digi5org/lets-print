# Email Verification System - Testing Guide

## Prerequisites
- Backend server running on http://localhost:5000
- Frontend server running on http://localhost:3000
- Super admin account: admin@letsprint.com / SuperAdmin@123
- Database migrations applied

## Test Scenario: Create User with Email Verification

### Step 1: Login as Super Admin
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: admin@letsprint.com
   - Password: SuperAdmin@123
3. Click "Sign In"
4. Should redirect to http://localhost:3000/dashboard/admin

### Step 2: Create New User
1. On the SuperAdmin Dashboard, click "Add User" button
2. Fill in the form:
   - Full Name: Test User
   - Email: testuser@example.com
   - Role: Business Owner (or any role except super_admin)
   - Tenant: (optional)
3. Notice: No password field should be visible
4. Notice: Blue info banner says "A verification email will be sent to the user"
5. Click "Add User" button

### Step 3: Verify Backend Response
1. Check browser alert: "User created successfully. Verification email has been sent."
2. Check backend console (terminal where backend is running)
3. You should see email details printed:
```
=================================
📧 EMAIL WOULD BE SENT:
=================================
To: testuser@example.com
Subject: Complete Your Registration - LetsPrint

Hi Test User,

Your account has been created by the administrator. To complete your registration and activate your account, please set your password by visiting this link:

http://localhost:3000/verify-email?token=<64-char-token>

Important: This link will expire in 48 hours for security reasons.

If you didn't expect this email, please contact your administrator.

© 2024 LetsPrint. All rights reserved.
=================================
```
4. Copy the verification URL from the console

### Step 4: Verify Database State (Optional)
Using MySQL:
```sql
USE letsprint;
SELECT id, name, email, isActive, emailVerified, verificationToken, verificationTokenExp 
FROM User 
WHERE email = 'testuser@example.com';
```

Expected results:
- isActive: 0 (false)
- emailVerified: 0 (false)
- verificationToken: 64-character hex string
- verificationTokenExp: Current time + 48 hours
- password: NULL

### Step 5: Access Verification Page
1. Paste the verification URL into browser
2. Should navigate to http://localhost:3000/verify-email?token=...
3. Page should show:
   - Title: "Complete Your Registration"
   - Subtitle: "Set your password to activate your account"
   - Password input field
   - Confirm password input field
   - "Activate Account" button

### Step 6: Set Password
1. Enter password: TestUser@123
   - Note: Must meet requirements (8+ chars, uppercase, lowercase, number)
2. Enter confirm password: TestUser@123
3. Click "Activate Account" button

### Step 7: Verify Success
1. Page should show success message:
   - Green checkmark icon
   - "Email Verified Successfully!"
   - "Your account has been activated"
   - "Redirecting to login page..."
2. After 3 seconds, should redirect to http://localhost:3000/login

### Step 8: Login with New Account
1. On login page, enter:
   - Email: testuser@example.com
   - Password: TestUser@123
2. Click "Sign In"
3. Should successfully login and redirect to appropriate dashboard

### Step 9: Verify Database State After (Optional)
```sql
SELECT id, name, email, isActive, emailVerified, verificationToken, verificationTokenExp 
FROM User 
WHERE email = 'testuser@example.com';
```

Expected results:
- isActive: 1 (true)
- emailVerified: 1 (true)
- verificationToken: NULL
- verificationTokenExp: NULL
- password: <hashed-password>

## Error Cases to Test

### Test 1: Expired Token
1. Manually set verificationTokenExp to past date in database
2. Try to verify email
3. Should see error: "Verification token has expired. Please contact admin for a new invitation."

### Test 2: Invalid Token
1. Use a random token in URL: http://localhost:3000/verify-email?token=invalidtoken123
2. Should see error: "Invalid or expired verification token"

### Test 3: Password Mismatch
1. Enter different passwords in password and confirm fields
2. Should see error: "Passwords do not match"

### Test 4: Weak Password
1. Enter password: test123
2. Should see error: "Password must be at least 8 characters long and contain uppercase, lowercase, and number"

### Test 5: Missing Token
1. Navigate to: http://localhost:3000/verify-email (no token parameter)
2. Should see error: "Invalid verification link. Token is missing."
3. "Activate Account" button should be disabled

### Test 6: Reuse Token
1. Complete verification successfully
2. Try to use the same verification URL again
3. Should see error: "Invalid or expired verification token"

## API Testing (Using curl or Postman)

### Test Create User Endpoint
```bash
# Login as admin first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@letsprint.com","password":"SuperAdmin@123"}'

# Use the returned token in Authorization header
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-admin-token>" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "roleName": "business_owner"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User created successfully. Verification email sent to apitest@example.com",
  "data": {
    "id": "...",
    "name": "API Test User",
    "email": "apitest@example.com",
    "isActive": false,
    "emailVerified": false,
    "roleId": "...",
    "tenantId": null,
    "createdAt": "...",
    "updatedAt": "...",
    "role": { ... }
  }
}
```

### Test Verify Email Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<64-char-token-from-console>",
    "password": "TestUser@123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email verified successfully. You can now login with your credentials."
}
```

## Troubleshooting

### Backend not showing email logs
- Check that backend server is running
- Check that NODE_ENV=development in .env
- Restart backend server after .env changes

### Token not being generated
- Check database migration applied: `npx prisma migrate status`
- Check verificationToken column exists in User table
- Check no errors in backend console

### Verification page not loading
- Check frontend server running on port 3000
- Check file exists at: frontend/src/app/verify-email/page.jsx
- Check browser console for errors

### User cannot login after verification
- Check isActive and emailVerified set to true in database
- Check password was hashed correctly
- Try resetting password via database manually

### "Failed to send verification email" error
- This is non-critical in development mode
- Email is still logged to console
- User is still created in database

## Success Criteria

✅ Admin can create user without entering password
✅ Verification email details appear in backend console
✅ User record created with null password and inactive status
✅ Verification page accessible via token URL
✅ Password validation works correctly
✅ User can set password successfully
✅ User account activated after verification
✅ User can login with new credentials
✅ Token becomes invalid after use
✅ Expired tokens rejected properly

## Next Steps After Testing

1. **Production Email Setup**
   - Install nodemailer in backend
   - Configure SMTP settings in .env
   - Uncomment email sending code in emailService.js
   - Test with real email address

2. **Additional Features**
   - Implement "Resend verification email" feature
   - Add email verification status to user list
   - Show pending verifications count in dashboard
   - Add manual activation option for admins

3. **Security Enhancements**
   - Hash verification tokens before storing
   - Add rate limiting to verification endpoint
   - Implement account lockout after failed attempts
   - Add CAPTCHA to verification page
