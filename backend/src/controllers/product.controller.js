const productService = require("../services/product.service");
const { asyncHandler } = require("../utils/asyncHandler");

const listProducts = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.validated.query;
  const result = await productService.getProductCatalog({ search: q, page, limit });
  res.status(200).json(result);
});

const listAdminProducts = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.validated.query;
  const result = await productService.getAdminProductCatalog({ search: q, page, limit });
  res.status(200).json(result);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductDetail(req.validated.params.slug);
  res.status(200).json({ product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createAdminProduct(req.validated.body);
  res.status(201).json({ product });
});

const getAdminProductDetails = asyncHandler(async (req, res) => {
  const details = await productService.getAdminProductDetails(req.validated.params.id);
  res.status(200).json(details);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateAdminProduct(req.validated.params.id, req.validated.body);
  res.status(200).json({ product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteAdminProduct(req.validated.params.id);
  res.status(200).json({ product });
});

module.exports = {
  listProducts,
  listAdminProducts,
  getProductBySlug,
  createProduct,
  getAdminProductDetails,
  updateProduct,
  deleteProduct,
};
