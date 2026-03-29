const express = require("express");

const productController = require("../controllers/product.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
  listProductsSchema,
  productParamsSchema,
  adminProductParamsSchema,
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const router = express.Router();

router.get("/products", validate(listProductsSchema), productController.listProducts);
router.get("/products/:slug", validate(productParamsSchema), productController.getProductBySlug);

router.get(
  "/admin/products",
  requireAuth,
  requireAdmin,
  validate(listProductsSchema),
  productController.listAdminProducts,
);

router.post(
  "/admin/products",
  requireAuth,
  requireAdmin,
  validate(createProductSchema),
  productController.createProduct,
);

router.put(
  "/admin/products/:id",
  requireAuth,
  requireAdmin,
  validate(updateProductSchema),
  productController.updateProduct,
);

router.get(
  "/admin/products/:id",
  requireAuth,
  requireAdmin,
  validate(adminProductParamsSchema),
  productController.getAdminProductDetails,
);

router.delete(
  "/admin/products/:id",
  requireAuth,
  requireAdmin,
  validate(adminProductParamsSchema),
  productController.deleteProduct,
);

module.exports = router;
