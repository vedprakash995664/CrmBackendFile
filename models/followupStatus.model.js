import mongoose from "mongoose";

const followupStatusSchema = mongoose.Schema({
    followupStatusText: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "addedByType", // Dynamically set the reference based on `addedByType`
        required: true,
    },
    addedByType: {
        type: String,
        required: true,
        enum: ["Admin", "Employee"], // Specify allowed models
    },
}, { timestamps: true });

const FollowupStatus = new mongoose.model("FollowupStatus", followupStatusSchema);
export default FollowupStatus; 