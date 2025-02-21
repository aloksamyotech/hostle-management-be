import Superadmin from "../model/SuperAdmin.js";
import bcrypt from "bcryptjs";

export const createDefaultSuperadmin = async () => {
  try {
    const existingSuperadmin = await Superadmin.findOne();

    if (!existingSuperadmin) {
      const defaultSuperadmin = new Superadmin({
        name: "rohit malviya",
        email: "rohit@gmail.com",
        password: "1234",
        role: "SuperAdmin",
      });

      await defaultSuperadmin.save();
      console.log(" Default Superadmin created successfully.");
    } else {
      console.log(" Superadmin already exists.");
    }
  } catch (error) {
    console.error(" Error creating Superadmin:", error);
  }
};
