-- Add production team member roles
INSERT INTO roles (id, name, description, createdAt, updatedAt) 
VALUES 
  (UUID(), 'production_manager', 'Production manager with access to manage orders and inventory', NOW(), NOW()),
  (UUID(), 'production_staff', 'Production staff member with limited access to assigned tasks', NOW(), NOW()),
  (UUID(), 'machine_operator', 'Machine operator who updates job status', NOW(), NOW()),
  (UUID(), 'quality_inspector', 'Quality inspector who performs quality checks', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  description = VALUES(description),
  updatedAt = NOW();
