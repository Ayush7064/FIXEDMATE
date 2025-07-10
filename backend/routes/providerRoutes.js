const express = require("express");
const router = express.Router();
const { updateProviderProfile } = require("../controllers/providerController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { getProviderProfile } = require("../controllers/providerController");
const { getNearbyProviders } = require("../controllers/providerController");
const { getProviderById } = require("../controllers/providerController");


router.put(
  "/:id/profile",
  protect,
  authorizeRoles("service-provider"),
  updateProviderProfile
);

router.get(
  "/profile",
  protect,
  authorizeRoles("service-provider"),
  getProviderProfile
);

router.get("/nearby", getNearbyProviders);



router.get("/:id", getProviderById); // Add this after all fixed routes (e.g., /nearby, /profile)


module.exports = router;
