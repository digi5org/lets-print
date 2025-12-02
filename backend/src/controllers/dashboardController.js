import prisma from '../config/database.js';

// Get dashboard stats for production owner
export const getProductionStats = async (req, res, next) => {
  try {
    const { tenantId } = req.user;

    // Get order counts by status
    const [
      pendingOrders,
      processingOrders,
      printingOrders,
      completedToday,
      totalOrders,
    ] = await Promise.all([
      prisma.order.count({
        where: { 
          tenantId,
          status: 'PENDING' 
        },
      }),
      prisma.order.count({
        where: { 
          tenantId,
          status: 'PROCESSING' 
        },
      }),
      prisma.order.count({
        where: { 
          tenantId,
          status: 'PRINTING' 
        },
      }),
      prisma.order.count({
        where: {
          tenantId,
          status: 'COMPLETED',
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.count({
        where: { tenantId },
      }),
    ]);

    // Get revenue stats for current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthRevenue = await prisma.order.aggregate({
      where: {
        tenantId,
        status: 'COMPLETED',
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get previous month revenue for comparison
    const startOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const endOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    const prevMonthRevenue = await prisma.order.aggregate({
      where: {
        tenantId,
        status: 'COMPLETED',
        createdAt: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const currentRevenue = currentMonthRevenue._sum.totalAmount || 0;
    const prevRevenue = prevMonthRevenue._sum.totalAmount || 0;
    const revenueChange = prevRevenue > 0 
      ? ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)
      : 0;

    // Get yesterday's completed orders for comparison
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const completedYesterday = await prisma.order.count({
      where: {
        tenantId,
        status: 'COMPLETED',
        updatedAt: {
          gte: yesterday,
          lte: endOfYesterday,
        },
      },
    });

    res.json({
      success: true,
      data: {
        jobsInQueue: pendingOrders,
        inProgress: processingOrders + printingOrders,
        completedToday,
        completedYesterday,
        monthlyRevenue: currentRevenue,
        revenueChange: parseFloat(revenueChange),
        totalOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get recent orders/jobs
export const getRecentJobs = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await prisma.order.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Transform orders to job format
    const jobs = orders.map(order => {
      const productNames = order.orderItems.map(item => item.product.name).join(', ');
      const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        id: order.id,
        title: productNames,
        status: order.status,
        date: order.createdAt,
        dueDate: order.dueDate,
        quantity: `${totalQuantity} items`,
        total: order.totalAmount,
        customer: order.user.name || order.user.email,
        priority: order.priority || 'Medium',
        notes: order.notes,
      };
    });

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Get revenue chart data (last 6 months)
export const getRevenueChart = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const months = 6;
    const chartData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const revenue = await prisma.order.aggregate({
        where: {
          tenantId,
          status: 'COMPLETED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          totalAmount: true,
        },
      });

      chartData.push({
        month: startOfMonth.toLocaleDateString('en-US', { month: 'short' }),
        revenue: revenue._sum.totalAmount || 0,
      });
    }

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
};

// Get active job details (first in-progress job)
export const getActiveJob = async (req, res, next) => {
  try {
    const { tenantId } = req.user;

    const order = await prisma.order.findFirst({
      where: {
        tenantId,
        status: {
          in: ['PROCESSING', 'PRINTING'],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!order) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const productNames = order.orderItems.map(item => item.product.name).join(', ');
    
    const jobData = {
      id: order.id,
      title: productNames,
      status: order.status,
      customer: order.user.name || order.user.email,
      createdAt: order.createdAt,
      dueDate: order.dueDate,
      timeline: [
        {
          step: 'Job Received',
          completed: true,
          timestamp: order.createdAt,
        },
        {
          step: 'Materials Prepared',
          completed: order.status !== 'PENDING',
          timestamp: order.status !== 'PENDING' ? order.updatedAt : null,
        },
        {
          step: 'Production',
          completed: order.status === 'PRINTING' || order.status === 'COMPLETED',
          timestamp: order.status === 'PRINTING' || order.status === 'COMPLETED' ? order.updatedAt : null,
          active: order.status === 'PRINTING',
        },
        {
          step: 'Quality Check',
          completed: order.status === 'COMPLETED',
          timestamp: null,
        },
        {
          step: 'Ready for Delivery',
          completed: order.status === 'COMPLETED',
          timestamp: order.status === 'COMPLETED' ? order.updatedAt : null,
        },
      ],
    };

    res.json({
      success: true,
      data: jobData,
    });
  } catch (error) {
    next(error);
  }
};
