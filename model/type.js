import mongoose from "mongoose";

const roomtypeSchema = new mongoose.Schema(
  {
    Roomtypee: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Hostel",
    },
  },

  { timestamps: true }
);

const Roomtype = mongoose.model("Roomtype", roomtypeSchema);

export default Roomtype;
