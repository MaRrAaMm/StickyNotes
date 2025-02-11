import { Schema , model } from "mongoose";
const userSchema = new Schema({
    name:{ type: String, required:true},
    email:{ type: String, required:true, unique: true},
    password:{ type: String, required:true},
    phone:{ type: String, required:true},
    age:{ type: Number, min: 18, max: 60},

},{
    timestamps: true,
}
);
export const User = model("user",userSchema);