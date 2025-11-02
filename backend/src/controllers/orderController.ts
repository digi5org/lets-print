import { Response } from 'express';
import { Order, OrderItem } from '../models/Order';
import Product from '../models/Product';
import User, { UserRole } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    let whereClause: any = {};

    // Filter based on user role
    switch (req.user.role) {
      case UserRole.CLIENT:
        whereClause.clientId = req.user.id;
        break;
      case UserRole.STARTUP_OWNER:
        whereClause.startupOwnerId = req.user.id;
        break;
      case UserRole.PRODUCTION_OWNER:
        whereClause.productionOwnerId = req.user.id;
        break;
      case UserRole.SUPER_ADMIN:
        // No filter - see all orders
        break;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'startupOwner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'productionOwner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'category']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ orders, count: orders.length });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'startupOwner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'productionOwner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check authorization
    const hasAccess =
      req.user.role === UserRole.SUPER_ADMIN ||
      order.clientId === req.user.id ||
      order.startupOwnerId === req.user.id ||
      order.productionOwnerId === req.user.id;

    if (!hasAccess) {
      res.status(403).json({ message: 'Not authorized to view this order' });
      return;
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { clientId, startupOwnerId, items, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Order must contain at least one item' });
      return;
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        res.status(404).json({ message: `Product with id ${item.productId} not found` });
        return;
      }

      const subtotal = parseFloat(product.price.toString()) * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal
      });
    }

    // Create order
    const order = await Order.create({
      clientId: clientId || req.user.id,
      startupOwnerId: startupOwnerId || req.user.id,
      totalAmount,
      notes
    });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      });
    }

    // Fetch complete order with associations
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { status, productionOwnerId } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check authorization
    const canUpdate =
      req.user.role === UserRole.SUPER_ADMIN ||
      order.startupOwnerId === req.user.id ||
      order.productionOwnerId === req.user.id;

    if (!canUpdate) {
      res.status(403).json({ message: 'Not authorized to update this order' });
      return;
    }

    await order.update({
      status: status || order.status,
      productionOwnerId: productionOwnerId !== undefined ? productionOwnerId : order.productionOwnerId
    });

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
