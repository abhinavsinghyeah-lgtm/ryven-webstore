const express = require("express");

const collectionController = require("../controllers/collection.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
  listCollectionsSchema,
  collectionParamsSchema,
  adminCollectionParamsSchema,
  createCollectionSchema,
  updateCollectionSchema,
} = require("../validators/collection.validator");

const router = express.Router();

router.get("/collections", validate(listCollectionsSchema), collectionController.listCollections);
router.get("/collections/:slug", validate(collectionParamsSchema), collectionController.getCollectionBySlug);

router.get("/admin/collections", requireAuth, requireAdmin, collectionController.listAdminCollections);
router.get("/admin/collections/:id", requireAuth, requireAdmin, validate(adminCollectionParamsSchema), collectionController.getAdminCollectionById);
router.post("/admin/collections", requireAuth, requireAdmin, validate(createCollectionSchema), collectionController.createCollection);
router.put("/admin/collections/:id", requireAuth, requireAdmin, validate(updateCollectionSchema), collectionController.updateCollection);
router.delete("/admin/collections/:id", requireAuth, requireAdmin, validate(adminCollectionParamsSchema), collectionController.deleteCollection);

module.exports = router;
