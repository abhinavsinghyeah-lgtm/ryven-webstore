const collectionService = require("../services/collection.service");
const { asyncHandler } = require("../utils/asyncHandler");

const listCollections = asyncHandler(async (req, res) => {
  const { page, limit, featured } = req.validated.query;
  const result = await collectionService.getCollectionCatalog({ page, limit, featuredOnly: featured });
  res.status(200).json(result);
});

const getCollectionBySlug = asyncHandler(async (req, res) => {
  const result = await collectionService.getCollectionDetail(req.validated.params.slug);
  res.status(200).json(result);
});

const listAdminCollections = asyncHandler(async (_req, res) => {
  const result = await collectionService.getAdminCollectionCatalog();
  res.status(200).json(result);
});

const getAdminCollectionById = asyncHandler(async (req, res) => {
  const result = await collectionService.getAdminCollectionDetail(req.validated.params.id);
  res.status(200).json(result);
});

const createCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.createAdminCollection(req.validated.body);
  res.status(201).json({ collection });
});

const updateCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.updateAdminCollection(req.validated.params.id, req.validated.body);
  res.status(200).json({ collection });
});

const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.deleteAdminCollection(req.validated.params.id);
  res.status(200).json({ collection });
});

module.exports = {
  listCollections,
  getCollectionBySlug,
  listAdminCollections,
  getAdminCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};
