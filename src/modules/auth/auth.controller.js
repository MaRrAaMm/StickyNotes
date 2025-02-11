import { Router } from "express";
import {signup , login} from "./auth.service.js"
import { asyncHandler } from "../../utils/error/async-handler.js";

const router = Router();
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));

export default router;