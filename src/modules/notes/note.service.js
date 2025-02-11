import { Notes } from "../../db/models/notes.mode.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { User } from "../../db/models/user.model.js";
import mongoose from "mongoose";

export const createNote = asyncHandler(async(req, res, next) => {
    const { title, content } = req.body;
    const userId = req.user.id; 
    const note = await Notes.create({
        title,
        content,
        userId
    });
    return res.status(201).json({note});
});

export const updateNote = asyncHandler(async(req, res, next) => {
    const { noteId } = req.params; 
    const { title, content } = req.body;
    const userId = req.user.id; 
    const note = await Notes.findOne({ _id: noteId, userId });
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    await note.save();
    return res.status(200).json({ message: "Note updated successfully" });
});

export const replaceNote = asyncHandler(async(req, res, next) => {
    const { noteId } = req.params; 
    const { title, content } = req.body;
    const userId = req.user.id; 
    const note = await Notes.findOne({ _id: noteId, userId });
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    note.title = title;
    note.content = content;
    note.updatedAt = new Date();
    await note.save();
    return res.status(200).json({
        id: note._id.toString(), 
        title: note.title,
        content: note.content,
        userId: note.userId.toString(),
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString()
    });
});

export const updateAllNotes = asyncHandler(async(req, res, next) =>{
    const { title } = req.body;
    const userId = req.user.id; 
    if (!title) {
        return res.status(400).json({ message: "title is required"});
    }
    const updatedNotes = await Notes.updateMany({ userId }, { title });
    return res.status(200).json({ 
        message: "All notes updated", 
    });
});

export const deleteNote = asyncHandler(async(req, res, next) =>{
    const { noteId } = req.params; 
    const userId = req.user.id; 
    const note = await Notes.findOneAndDelete({ _id: noteId, userId});
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({
        message: "deleted",
        note: {
            id: note._id,
            title: note.title,
            content: note.content,
            userId: note.userId,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        }
    });
});


export const getNotes = async(req, res) => {
    const userId = req.user.id;
    const notes = await Notes.find({ userId });
    res.status(200).json({
        message: "Notes retrieved successfully",
        notes,
    });
};


export const getNoteById = asyncHandler(async(req, res) =>{
    const userId = req.user.id; 
    const noteId = req.params.id; 
    const note = await Notes.findOne({ _id: noteId, userId });
    if (!note){
        return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({note});
});

export const getNotesWithUser = asyncHandler(async(req, res) =>{
    const userId = req.user.id; 
    const notes = await Notes.find({ userId }) 
        .select("title content userId createdAt updatedAt"); 
    const formattedNotes = notes.map(note => ({
        id: note._id, 
        title: note.title,
        content: note.content,
        userId: note.userId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
    }));
    res.status(200).json(formattedNotes); 
});

export const getAggregatedNotes = asyncHandler(async(req, res) =>{
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ message: "invalid request" });
        }
        const { title } = req.query;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const userNotesPipeline = [
            { $match: { userId: userObjectId } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    title: 1,
                    userId: 1,
                    createdAt: 1,
                    user: { name: "$user.name", email: "$user.email" }
                }
            }
        ];
        if (title) {
            userNotesPipeline.unshift({ 
                $match: { title: { $regex: title, $options: "i" } } 
            });
        }
        const notes = await Notes.aggregate(userNotesPipeline);
        return res.status(200).json({notes});
    } catch (error) {
        return res.status(500).json({ 
            message: "Internal server error",
            error: JSON.stringify(error, null, 2)
        });
    }
});


export const deleteAllNotes = asyncHandler(async(req, res, next) => {
    try {
        const userId = req.user.id; 
        const deletedNotes = await Notes.deleteMany({ userId });
        res.status(200).json({
            message: "All notes deleted successfully",
            deletedCount: deletedNotes.deletedCount
        });
    } catch (error) {
        next(error);
    }
});
