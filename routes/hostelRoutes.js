import express from "express";
import hostel from "../controllers/hostel.js";
const router = express.Router();
import authenticateUser from "../middlewares/auth.js";
import combinedUpload from "../utils/upload.js";

router.post("/addnew", combinedUpload, hostel.addNew);
router.get("/list", hostel.index);
router.get("/view/:id", hostel.view);
router.get("/SuperAdmin/:id", hostel.views);
router.put("/edit/:id", combinedUpload, hostel.edit);
router.delete("/delete/:id", hostel.deleteData);
router.get("/availablebeds/:id", hostel.bedsCount);
router.put("/update_password", authenticateUser, hostel.updatePassword);

export default router;
