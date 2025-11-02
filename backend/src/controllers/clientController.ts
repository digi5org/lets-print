import { Response } from 'express';
import User, { UserRole } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const clients = await User.findAll({
      where: { role: UserRole.CLIENT, isActive: true },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({ clients, count: clients.length });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const client = await User.findOne({
      where: { id, role: UserRole.CLIENT },
      attributes: { exclude: ['password'] }
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    res.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateClientStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { isActive } = req.body;

    const client = await User.findOne({
      where: { id, role: UserRole.CLIENT }
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    await client.update({ isActive });

    res.json({
      message: 'Client status updated successfully',
      client: {
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        isActive: client.isActive
      }
    });
  } catch (error) {
    console.error('Update client status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
