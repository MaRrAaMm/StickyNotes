import { Schema, Types, model } from "mongoose";
const notesSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            validate: {
                validator: function (value){
                    return value !== value.toUpperCase();
                },
            }
        },
        content: { type: String, required: true },
        userId: { type: Types.ObjectId, ref: "user", required: true }
    },
    {timestamps: true}
);
export const Notes = model("notes",notesSchema);
