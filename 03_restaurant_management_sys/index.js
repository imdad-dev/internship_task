require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(` Restaurant Management System running at http://localhost:${PORT}`);
    console.log(`   Admin panel:  http://localhost:${PORT}/admin/login`);
  });
};

startServer();
