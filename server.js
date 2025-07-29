import express from "express";
import dotenv from "dotenv";
import { init_DB} from "./config/db.js";
import apiratelimiter from "./middleware/ratelimiter.js";
import transactionsRoute from "./routes/transactionsRoutes.js"

dotenv.config();

       

const app = express();

// Middleware
app.use(express.json());
app.use("/api/transactions",transactionsRoute)
app.use((req, res, next) => {
  console.log("we hit the api req...", req.method);
  next();
});

const PORT = process.env.PORT;

// Initialize DB


// Routes


app.get("/", (req, res) => {
  res.send("It's working");
});
init_DB().then(() => {
  console.log("Application server is updated and running on port:", PORT);
});

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
