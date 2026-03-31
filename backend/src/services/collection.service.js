const {
  listCollections,
  countCollections,
  findCollectionBySlug,
  findCollectionById,
  listProductsForCollection,
  listCollectionProductIds,
  createCollection,
  updateCollectionById,
  deleteCollectionById,
  replaceCollectionProducts,
} = require("../models/collection.model");
const { ApiError } = require("../utils/apiError");
const { sanitizeText } = require("../utils/sanitize");

const normalizeCollectionInput = (payload) => ({
  name: sanitizeText(payload.name),
  slug: sanitizeText(payload.slug.toLowerCase()),
  description: sanitizeText(payload.description),
  imageUrl: payload.imageUrl.trim(),
  featuredOnHome: payload.featuredOnHome,
  homePosition: payload.homePosition,
  isActive: payload.isActive,
  productIds: Array.from(new Set((payload.productIds || []).map(Number).filter((value) => Number.isInteger(value) && value > 0))),
});

const getCollectionCatalog = async ({ featuredOnly = false, page = 1, limit = 24, onlyActive = true }) => {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit > 60 ? 60 : limit;
  const offset = (safePage - 1) * safeLimit;
  const [collections, total] = await Promise.all([
    listCollections({ featuredOnly, limit: safeLimit, offset, onlyActive }),
    countCollections({ featuredOnly, onlyActive }),
  ]);

  return {
    collections,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const getCollectionDetail = async (slug) => {
  const collection = await findCollectionBySlug(slug);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }
  const products = await listProductsForCollection(collection.id);
  return {
    collection,
    products,
  };
};

const getAdminCollectionCatalog = async () => {
  const collections = await listCollections({ onlyActive: false, featuredOnly: false, limit: 100, offset: 0 });
  return { collections };
};

const getAdminCollectionDetail = async (id) => {
  const collection = await findCollectionById(id);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }
  const [products, productIds] = await Promise.all([listProductsForCollection(id), listCollectionProductIds(id)]);
  return {
    collection: {
      ...collection,
      productIds,
    },
    products,
  };
};

const createAdminCollection = async (payload) => {
  const normalized = normalizeCollectionInput(payload);
  try {
    const collection = await createCollection(normalized);
    await replaceCollectionProducts(collection.id, normalized.productIds);
    return {
      ...collection,
      productCount: normalized.productIds.length,
      productIds: normalized.productIds,
    };
  } catch (error) {
    if (error?.code === "23505") {
      throw new ApiError(409, "Collection slug already exists");
    }
    throw error;
  }
};

const updateAdminCollection = async (id, payload) => {
  const normalized = normalizeCollectionInput(payload);
  try {
    const collection = await updateCollectionById(id, normalized);
    if (!collection) {
      throw new ApiError(404, "Collection not found");
    }
    await replaceCollectionProducts(id, normalized.productIds);
    return {
      ...collection,
      productCount: normalized.productIds.length,
      productIds: normalized.productIds,
    };
  } catch (error) {
    if (error?.code === "23505") {
      throw new ApiError(409, "Collection slug already exists");
    }
    throw error;
  }
};

const deleteAdminCollection = async (id) => {
  const collection = await deleteCollectionById(id);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }
  return collection;
};

module.exports = {
  getCollectionCatalog,
  getCollectionDetail,
  getAdminCollectionCatalog,
  getAdminCollectionDetail,
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
};
