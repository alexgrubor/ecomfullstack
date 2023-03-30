import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    data:{
        type: Buffer,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
})

const Image = mongoose.model("images", imageSchema);

export default Image;