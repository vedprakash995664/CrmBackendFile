import mongoose from "mongoose";

const leadSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: "NA"
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  // lead address
  sources: {
    type: String
  },

  country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
  priority: {
    type: String,
  },

  // Lead Status
  leadStatus: {
    type: String,

  },
  leadAssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  tags:{
    type:[String]
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  closed: {
    type: Boolean,
    required: true,
    default: false
  },
  negative: {
    type: Boolean,
    required: true,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "addedByType",
    required: true,
  },
  addedByType: {
    type: String,
    required: true,
    enum: ["Admin", "Employee"],
  },


}, { timestamps: true })

const Lead = new mongoose.model("Lead", leadSchema)
export default Lead;
