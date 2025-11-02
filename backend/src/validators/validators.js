import { body, param } from 'express-validator';

// Product validations
export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').optional().trim(),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

export const updateProductValidation = [
  param('id').isUUID().withMessage('Invalid product ID'),
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim(),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('imageUrl').optional(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

// Order validations
export const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').isUUID().withMessage('Invalid product ID'),
  body('items.*.designId').optional().isUUID().withMessage('Invalid design ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('notes').optional().trim(),
];

export const updateOrderStatusValidation = [
  param('id').isUUID().withMessage('Invalid order ID'),
  body('status')
    .isIn(['PENDING', 'PROCESSING', 'PRINTING', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid order status'),
];

// Design validations
export const createDesignValidation = [
  body('name').trim().notEmpty().withMessage('Design name is required'),
  body('fileUrl').isURL().withMessage('Invalid file URL'),
  body('fileType').trim().notEmpty().withMessage('File type is required'),
  body('fileSize').isInt({ min: 1 }).withMessage('File size must be a positive number'),
  body('thumbnailUrl').optional().isURL().withMessage('Invalid thumbnail URL'),
];

export const updateDesignValidation = [
  param('id').isUUID().withMessage('Invalid design ID'),
  body('name').optional().trim().notEmpty().withMessage('Design name cannot be empty'),
  body('thumbnailUrl').optional(),
];

// User validations
export const updateProfileValidation = [
  body('name').optional().trim(),
];

export const updateUserRoleValidation = [
  param('id').isUUID().withMessage('Invalid user ID'),
  body('role').isIn(['ADMIN', 'USER']).withMessage('Invalid role'),
];

// ID param validation
export const idParamValidation = [
  param('id').isUUID().withMessage('Invalid ID'),
];
