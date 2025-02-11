import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) =>{
    try {
        const token = req.headers.authorization;
        if (!token){
            return res.status(401).json({message: "unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message:"Invalid token"});
    }
};
