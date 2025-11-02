# Quick Role Testing Guide

## How to Test Different Dashboard Views

### Step 1: Open the Dashboard Page
Navigate to: `frontend/src/app/dashboard/page.jsx`

### Step 2: Change the User Role
Find this section at the top of the file (around line 9-12):

```javascript
const MOCK_USER = {
  name: "John Doe",
  role: "client", // ← Change this line
};
```

### Step 3: Set Your Desired Role

Replace `"client"` with one of these values:

#### Option 1: Client Dashboard
```javascript
role: "client"
```
**Shows:** Order viewing, status tracking, design upload

---

#### Option 2: Business Owner Dashboard
```javascript
role: "business_owner"
```
**Shows:** Product management, order management, CRM, production submission

---

#### Option 3: Production Owner Dashboard
```javascript
role: "production_owner"
```
**Shows:** Job queue, status updates, business communication

---

#### Option 4: SuperAdmin Dashboard
```javascript
role: "superadmin"
```
**Shows:** System stats, user management, subscription controls

---

### Step 4: Save and View
1. Save the file
2. The page will automatically refresh (if using dev server)
3. You'll see the dashboard for the selected role

### Step 5: Customize the User Name (Optional)
You can also change the user name:

```javascript
const MOCK_USER = {
  name: "Sarah Smith", // ← Change this
  role: "business_owner",
};
```

## Quick Copy-Paste Options

### Test as Client
```javascript
const MOCK_USER = {
  name: "John Doe",
  role: "client",
};
```

### Test as Business Owner
```javascript
const MOCK_USER = {
  name: "Sarah Smith",
  role: "business_owner",
};
```

### Test as Production Owner
```javascript
const MOCK_USER = {
  name: "Mike Johnson",
  role: "production_owner",
};
```

### Test as SuperAdmin
```javascript
const MOCK_USER = {
  name: "Admin User",
  role: "superadmin",
};
```

## What Changes Between Roles?

### Navigation Menu
Each role has different menu items in the sidebar.

### Dashboard Content
Each role sees a completely different dashboard with role-specific:
- Statistics
- Tables
- Actions
- Features

### Available Actions
Different buttons and modals based on what each role needs to do.

## Tips

- The navigation menu automatically updates based on role
- Mock data is different for each dashboard
- All interactive elements have placeholder functions (TODO comments)
- Modals and forms are fully functional (UI only, no backend yet)

## Need More Info?

See `DASHBOARD_COMPONENTS.md` for detailed documentation of each dashboard component.
