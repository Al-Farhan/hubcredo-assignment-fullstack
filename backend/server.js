import "dotenv/config";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import path from "node:path";

import homeRouter from "./routes/root.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import { corsOptions } from "./config/corsOptions.js";

const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", homeRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

// Catch all other routes
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
