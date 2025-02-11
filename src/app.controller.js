import connectDB from "./db/connection.js";
import authRouter from "./modules/auth/auth.controller.js"; 
import userRouter from "./modules/user/user.controller.js"; 
import router from "./modules/notes/note.controller.js";
const bootstrap = async(app, express) =>{
    app.use(express.json());

    await connectDB();
    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/notes", router);
};
export default bootstrap;