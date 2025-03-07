import express from "express";
import { getBlockmail, toggerRole } from "../controllers/Emailblocked.js";
import authenticateUser from "../middlewares/auth.js";

const router = express.Router();

router.get("/get_block_email", authenticateUser, getBlockmail);
router.post("/add", authenticateUser, toggerRole);

export default router;
