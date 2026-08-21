import dotenv from "dotenv";
dotenv.config();

import seedAdmin from "./seed/admin.seed.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port,"0.0.0.0", () => {
      console.log(
        `🚀 Server running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Jeevan Sanjavni Backend is Working 🚀",
  });
});
