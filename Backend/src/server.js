import dotenv from "dotenv";
dotenv.config();

import seedAdmin from "./seed/admin.seed.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
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
 await seedAdmin();