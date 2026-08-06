import User from "../modules/auth/user.model.js";
import ROLES from "../constants/roles.js";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: ROLES.ADMIN });

    if (adminExists) {
      console.log("✅ Admin already exists");
      return;
    }

    await User.create({
      fullName: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      phone: process.env.ADMIN_PHONE,
      password: process.env.ADMIN_PASSWORD,
      role: ROLES.ADMIN,
      isVerified: true,
      isActive: true,
    });

    console.log("✅ Default admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
};

export default seedAdmin;