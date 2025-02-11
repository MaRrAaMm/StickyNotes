import { User } from "../../db/models/user.model.js";
import { hash } from "../../utils/hash/hash.js";
import { compare } from "../../utils/hash/compare.js";
import { encrypt } from "../../utils/crypto/crypto.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/error/async-handler.js";

// sign
export const signup = asyncHandler(async(req, res, next) =>{    
        const {name, email, password, phone, age} = req.body;
        const existingUser = await User.findOne({ email });
    if (existingUser){
        return res.status(400).json({success: false, message:"email already exists"});
    }
        
// create user
    const createdUser = await User.create({
        name,
        email,
        password:hash(password),
        phone: encrypt(phone), 
        age
    });
    return res.status(201).json({
        success: true,
        message: "user created successfully",
        userId: createdUser._id,
    });
});
// login
export const login = asyncHandler(async (req, res, next) => {
            const { email, password } = req.body;
            const userExist = await User.findOne({ email });
            if (!userExist) {
                return next(new Error("email not found", { cause: 401 }));
            }
            //check password
            const match = compare(password, userExist.password);
            if (!match) {
                return next(new Error("invalid password", { cause: 401 }));
            }
            // token
             const token =  jwt.sign(
                 { email, id: userExist._id },
                 process.env.SECRET_JWT,
                { expiresIn: "1h" }
                );
                // send response
                return res.status(200).json({
//                    success: true,
                    message: "login successfully",
                    token, 
                });
});
