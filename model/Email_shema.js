import mongoose from "mongoose";

const blockedRoleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  isBlocked: { type: Boolean, default: false },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const BlockedRole = mongoose.model("BlockedRole", blockedRoleSchema);
export default BlockedRole;
