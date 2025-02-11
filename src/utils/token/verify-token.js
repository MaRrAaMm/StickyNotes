import jwt from "jsonwebtoken";
export const verify =({token, secretKey = process.env.SECRE_JET}) =>{
    try{
    return jwt.verify(token, secretKey); // payload
    } catch(error){
      return{error};
    }
     // >> throw error
};