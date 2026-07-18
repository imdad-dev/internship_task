require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 HireLoop Job Board running at http://localhost:${PORT}`);
    console.log(`   Candidate: http://localhost:${PORT}/candidate/login`);
    console.log(`   Employer:  http://localhost:${PORT}/employer/login`);
    console.log(`   Admin:     http://localhost:${PORT}/admin/login`);
  });
};

startServer();
