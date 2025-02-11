import { Router } from "express";
import { updateUser } from "./user.service.js"
import { asyncHandler } from "../../utils/error/async-handler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { deleteUser } from "./user.service.js";
import { getUser } from "./user.service.js";
const router = Router();
router.patch("/", authMiddleware, asyncHandler(updateUser));
router.delete("/", authMiddleware, asyncHandler(deleteUser));
router.get("/", authMiddleware, asyncHandler(getUser));
export default router;