import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: { type: String, required: true },
  numOfBeds: { type: Number, required: true },
  occupiedBeds: { type: Number, required: true, default: 0 },
  availableBeds: { type: Number, required: true },
  bedIDs: [
    {
      bedId: { type: String, required: true },
      active: { type: Boolean, default: true },
      studentName: { type: String, default: null },
    },
  ],
  roomphoto: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Hostel",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Room", RoomSchema);
