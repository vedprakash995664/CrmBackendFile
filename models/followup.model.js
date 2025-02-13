import mongoose from "mongoose";

const followupSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead", // Reference to the Lead schema
      required: true,
    },
  
    followupStatus: {
      type: String,
      trim: true,
      required:true
    },
    priority:{
      type: String,
      trim: true,
      required:true
    },
    followedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Reference to the user (Salesperson)
      required:true
    },
    followupMessage: {
      type: String,
      trim: true,
      required:true
    },
    nextFollowupDate: {   
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Followup = new mongoose.model("Followup", followupSchema);

export default Followup
