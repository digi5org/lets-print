// Type definitions converted to JSDoc comments for JavaScript

/**
 * @typedef {'client' | 'business_owner' | 'production_owner' | 'superadmin'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} name
 * @property {string} href
 * @property {string} icon
 * @property {UserRole[]} roles
 */

export {};
