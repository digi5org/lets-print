import { Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { UserRole } from '../models/User';

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });

    res.json({ products, count: products.length });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { name, description, category, price, unit } = req.body;

    if (!name || !category || !price) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      unit: unit || 'piece',
      ownerId: req.user.id,
      isActive: true
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { name, description, category, price, unit, isActive } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check ownership or admin privileges
    if (product.ownerId !== req.user.id && req.user.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({ message: 'Not authorized to update this product' });
      return;
    }

    await product.update({
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      category: category || product.category,
      price: price || product.price,
      unit: unit || product.unit,
      isActive: isActive !== undefined ? isActive : product.isActive
    });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check ownership or admin privileges
    if (product.ownerId !== req.user.id && req.user.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({ message: 'Not authorized to delete this product' });
      return;
    }

    // Soft delete by setting isActive to false
    await product.update({ isActive: false });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
