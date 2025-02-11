import { User } from "../../db/models/user.model.js";
import { asyncHandler } from "../../utils/error/async-handler.js";

//update
export const updateUser = asyncHandler(async (req, res, next) =>{
    const { name, email, phone } = req.body;
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "user not found"});
    }
    if (email && email !== user.email){
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "email already exists"});
        }
        user.email = email;
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    return res.status(200).json({ message: "user updated successfully" });
});

// delete user
export const deleteUser = asyncHandler(async (req, res, next) =>{
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "user not found"});
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "user deleted successfully"});
});

// get user
export const getUser = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; 
    const user = await User.findById(userId).select("-password"); 
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ user });
});
