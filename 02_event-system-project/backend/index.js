import dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors"
import connectMongo from "./config/db.js";


const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectMongo(process.env.MONGODB_URI);
 

 
// Test route
app.get('/', (req, res) => {
  res.send("Event Registration API running...");
});

const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

 