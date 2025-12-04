import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products from master catalog (SuperAdmin/Production Owner view)
export const getAllProducts = async (req, res) => {
  try {
    const { category, isActive, search } = req.query;

    const where = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        tenantProducts: {
          include: {
            tenant: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

// Get products for a specific tenant (Business Owner view)
export const getTenantProducts = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { includeInactive } = req.query;

    // Get all products with tenant-specific data
    const products = await prisma.product.findMany({
      where: {
        isActive: true // Only show globally active products
      },
      include: {
        tenantProducts: {
          where: {
            tenantId: tenantId
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to include tenant-specific status
    const transformedProducts = products.map(product => ({
      ...product,
      tenantIsActive: product.tenantProducts[0]?.isActive || false,
      customPrice: product.tenantProducts[0]?.customPrice || null,
      isEnabledForTenant: product.tenantProducts.length > 0
    }));

    // Filter based on includeInactive flag
    const filteredProducts = includeInactive === 'true'
      ? transformedProducts
      : transformedProducts.filter(p => p.tenantIsActive);

    res.json({ success: true, data: filteredProducts });
  } catch (error) {
    console.error('Error fetching tenant products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tenant products', error: error.message });
  }
};

// Get products available for clients (Client view)
export const getClientProducts = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenantProducts = await prisma.tenantProduct.findMany({
      where: {
        tenantId: tenantId,
        isActive: true,
        product: {
          isActive: true
        }
      },
      include: {
        product: true
      }
    });

    const products = tenantProducts.map(tp => ({
      ...tp.product,
      price: tp.customPrice || tp.product.price
    }));

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching client products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch client products', error: error.message });
  }
};

// Create a new product (SuperAdmin/Production Owner)
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, imageUrl, specifications } = req.body;
    const userId = req.user.id;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: parseFloat(price),
        imageUrl,
        specifications,
        createdBy: userId,
        isActive: true
      }
    });

    res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// Update a product (SuperAdmin/Production Owner)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, imageUrl, specifications, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(price && { price: parseFloat(price) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(specifications !== undefined && { specifications }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// Delete a product (SuperAdmin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

// Enable/Disable product for a tenant (Business Owner)
export const toggleTenantProduct = async (req, res) => {
  try {
    const { productId, tenantId } = req.params;
    const { isActive, customPrice } = req.body;

    // Check if tenant-product relationship exists
    const existing = await prisma.tenantProduct.findUnique({
      where: {
        tenantId_productId: {
          tenantId,
          productId
        }
      }
    });

    let tenantProduct;

    if (existing) {
      // Update existing relationship
      tenantProduct = await prisma.tenantProduct.update({
        where: {
          tenantId_productId: {
            tenantId,
            productId
          }
        },
        data: {
          ...(isActive !== undefined && { isActive }),
          ...(customPrice !== undefined && { customPrice: customPrice ? parseFloat(customPrice) : null })
        }
      });
    } else {
      // Create new relationship
      tenantProduct = await prisma.tenantProduct.create({
        data: {
          tenantId,
          productId,
          isActive: isActive !== undefined ? isActive : true,
          customPrice: customPrice ? parseFloat(customPrice) : null
        }
      });
    }

    res.json({ success: true, data: tenantProduct, message: 'Product status updated successfully' });
  } catch (error) {
    console.error('Error toggling tenant product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product status', error: error.message });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });

    res.json({ success: true, data: categories.map(c => c.category) });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};
