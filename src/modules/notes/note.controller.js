import { Router } from "express";
import { createNote } from "./note.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js"; 
import { updateNote } from "./note.service.js";
import { replaceNote } from "./note.service.js";
import { updateAllNotes } from "./note.service.js";
import { deleteNote } from "./note.service.js";
import { getNotes } from "./note.service.js";
import { getNoteById } from "./note.service.js";
import { getNotesWithUser } from "./note.service.js";
import { getAggregatedNotes } from "./note.service.js";
import { deleteAllNotes } from "./note.service.js";
const router = Router();

router.post("/", authMiddleware, asyncHandler(createNote));
router.patch("/all", authMiddleware, asyncHandler(updateAllNotes));
router.patch("/:noteId", authMiddleware, asyncHandler(updateNote));
router.put("/replace/:noteId", authMiddleware, asyncHandler(replaceNote));
// router.patch("/all", authMiddleware, asyncHandler(updateAllNotesTitle));
router.delete("/:noteId", authMiddleware, asyncHandler(deleteNote));
router.get("/", authMiddleware, asyncHandler(getNotes));
router.get("/note-with-user", authMiddleware, asyncHandler(getNotesWithUser));
router.get("/aggregate", authMiddleware, asyncHandler(getAggregatedNotes));
router.get("/:id", authMiddleware, asyncHandler( getNoteById));
router.delete("/replace/:noteId", authMiddleware, asyncHandler( deleteAllNotes));

export default router;
