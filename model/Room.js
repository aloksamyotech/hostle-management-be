import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true, unique: true },
  roomType: { type: String, required: true },
  numOfBeds: { type: Number, required: true },
  occupiedBeds: { type: Number, required: true, default: 0 },
  availableBeds: { type: Number, required: true },
  bedIDs: { type: [String], required: true }, // Array of unique IDs for each bed
  roomphoto: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Hostel",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Room", RoomSchema);
