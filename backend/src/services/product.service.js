const {
  listProducts,
  listAdminProducts,
  countProducts,
  countAdminProducts,
  findProductBySlug,
  createProduct,
  getAdminProductDetail,
  updateProductById,
  deleteProductById,
} = require("../models/product.model");
const { ApiError } = require("../utils/apiError");
const { sanitizeText } = require("../utils/sanitize");

const normalizeProductInput = (payload) => ({
  name: sanitizeText(payload.name),
  slug: sanitizeText(payload.slug.toLowerCase()),
  shortDescription: sanitizeText(payload.shortDescription),
  description: sanitizeText(payload.description),
  pricePaise: payload.pricePaise,
  currency: payload.currency.toUpperCase(),
  imageUrl: payload.imageUrl.trim(),
  notes: payload.notes.map((note) => sanitizeText(note)).filter(Boolean),
  category: sanitizeText(payload.category),
  isActive: payload.isActive,
});

const getProductCatalog = async ({ search, page, limit }) => {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit > 40 ? 40 : limit;
  const offset = (safePage - 1) * safeLimit;

  const [products, total] = await Promise.all([
    listProducts({ search, limit: safeLimit, offset }),
    countProducts({ search }),
  ]);

  return {
    products,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const getAdminProductCatalog = async ({ search, page, limit }) => {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit > 60 ? 60 : limit;
  const offset = (safePage - 1) * safeLimit;

  const [products, total] = await Promise.all([
    listAdminProducts({ search, limit: safeLimit, offset }),
    countAdminProducts({ search }),
  ]);

  return {
    products,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const getProductDetail = async (slug) => {
  const product = await findProductBySlug(slug);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

const createAdminProduct = async (payload) => {
  const normalized = normalizeProductInput(payload);
  try {
    return await createProduct(normalized);
  } catch (error) {
    if (error?.code === "23505") {
      throw new ApiError(409, "Product slug already exists");
    }
    throw error;
  }
};

const getAdminProductDetails = async (id) => {
  const product = await getAdminProductDetail(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const placeholderReviews = [
    {
      id: "coming-soon-1",
      rating: 5,
      title: "Premium presentation",
      body: "Reviews module lands soon. This placeholder previews how customer sentiment will appear here.",
      createdAt: product.createdAt,
      customerName: "Review module pending",
    },
    {
      id: "coming-soon-2",
      rating: 4,
      title: "Catalog insights ready",
      body: "Once reviews are enabled, this panel will show review text, moderation status, and customer context.",
      createdAt: product.updatedAt,
      customerName: "RYVEN system note",
    },
  ];

  return {
    product,
    reviews: placeholderReviews,
  };
};

const updateAdminProduct = async (id, payload) => {
  const normalized = normalizeProductInput(payload);

  try {
    const product = await updateProductById(id, normalized);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return product;
  } catch (error) {
    if (error?.code === "23505") {
      throw new ApiError(409, "Product slug already exists");
    }
    throw error;
  }
};

const deleteAdminProduct = async (id) => {
  const product = await deleteProductById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

module.exports = {
  getProductCatalog,
  getAdminProductCatalog,
  getProductDetail,
  createAdminProduct,
  getAdminProductDetails,
  updateAdminProduct,
  deleteAdminProduct,
};
