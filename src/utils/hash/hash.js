import bcrypt from "bcrypt";
export const hash = (password)=>{
    return bcrypt.hashSync(password, 10);
};