# Production Team Role Structure

## Overview
The production team has a hierarchical role structure that allows for different levels of access and permissions within the production dashboard.

## Role Hierarchy

### 1. Production Owner (`production_owner`)
- **Access Level**: Full access
- **Permissions**:
  - View all production dashboard features
  - Manage team members (add, edit, delete)
  - Manage orders, inventory, and materials
  - View reports and analytics
  - Manage billing and products/services
  - Handle delivery management
  - Access messages and tickets
- **Description**: Production facility owner who manages the entire operation

### 2. Production Manager (`production_manager`)
- **Access Level**: High access
- **Permissions**:
  - Manage team members (add, edit, delete)
  - Manage orders and inventory
  - View reports and analytics
  - Manage products/services and materials
  - Handle delivery management
  - Access messages and tickets
  - View production dashboard
- **Description**: Senior manager with broad operational control

### 3. Production Staff (`production_staff`)
- **Access Level**: Limited access
- **Permissions**:
  - View team members (cannot add/edit/delete)
  - View and update assigned orders
  - Access messages and tickets
  - View own profile
  - View production dashboard
- **Description**: General production staff with access to assigned tasks

### 4. Machine Operator (`machine_operator`)
- **Access Level**: Specialized access
- **Permissions**:
  - View team members
  - Update job status for assigned machines
  - Access messages and tickets
  - View own profile
  - View production dashboard
- **Description**: Operates specific machines and updates job progress

### 5. Quality Inspector (`quality_inspector`)
- **Access Level**: Specialized access
- **Permissions**:
  - View team members
  - Update quality check status
  - Access messages and tickets
  - View own profile
  - View production dashboard
- **Description**: Performs quality checks and approvals

## Navigation Access Matrix

| Feature | Owner | Manager | Staff | Operator | Inspector |
|---------|-------|---------|-------|----------|-----------|
| Dashboard Overview | ✓ | ✓ | ✓ | ✓ | ✓ |
| Orders Management | ✓ | ✓ | ✓ | - | - |
| Billing | ✓ | ✓ | - | - | - |
| Products & Services | ✓ | ✓ | - | - | - |
| Materials & Inventory | ✓ | ✓ | - | - | - |
| Delivery Management | ✓ | ✓ | - | - | - |
| Messages | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tickets | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reports & Analytics | ✓ | ✓ | - | - | - |
| My Profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| Team Management | ✓ (full) | ✓ (full) | View only | View only | View only |

## Team Management Permissions

### Can Add/Edit/Delete Members:
- Production Owner
- Production Manager

### Can Only View Members:
- Production Staff
- Machine Operator
- Quality Inspector

## Technical Implementation

### Backend (Routes)
```javascript
// All production roles can view team
router.get('/team', authenticate, requireRole(
  'production_owner',
  'production_manager',
  'production_staff',
  'machine_operator',
  'quality_inspector',
  'superadmin'
), productionController.getTeamMembers);

// Only owner and manager can modify
router.post('/team', authenticate, requireRole(
  'production_owner',
  'production_manager',
  'superadmin'
), productionController.addTeamMember);
```

### Frontend (Permission Check)
```javascript
const canManageTeam = user?.role === "production_owner" || user?.role === "production_manager";

{canManageTeam && (
  <button onClick={() => setShowAddModal(true)}>
    Add Team Member
  </button>
)}
```

## Future Enhancements

### Potential Features:
1. **Department-based filtering**: Allow team members to be organized by departments
2. **Shift management**: Assign team members to specific shifts
3. **Task assignment**: Assign specific orders/jobs to team members
4. **Performance tracking**: Track productivity and quality metrics
5. **Custom permissions**: Allow production owners to customize permissions per role
6. **Notifications**: Send alerts to team members about assigned tasks
7. **Time tracking**: Log work hours and breaks
8. **Machine assignment**: Assign specific machines to operators

## Usage Example

When a Production Owner adds a new team member:
1. Click "Add Team Member" button (visible only to owner/manager)
2. Fill in name, email, and select role
3. System creates user with default password "ChangeMe123!"
4. Team member receives email notification
5. Team member logs in and is redirected to production dashboard
6. Dashboard shows only features they have permission to access

## Role Assignment Best Practices

- **Production Owner**: Assign to facility owners only (1 per tenant)
- **Production Manager**: Assign to supervisors and department heads (2-5 per tenant)
- **Production Staff**: General workers who handle various tasks (unlimited)
- **Machine Operator**: Specialized operators for specific equipment (as needed)
- **Quality Inspector**: QA personnel who approve work (2-3 per tenant)
