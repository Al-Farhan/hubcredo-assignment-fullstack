import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { usersTable } from "../models/User.js";
import { eq } from "drizzle-orm";
import axios from "axios";

export const createNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  if (!email || email.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  if (!password || password.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });
  }

  const [duplicateUser] = await db
    .select()
    .from(usersTable)
    .where((table) => eq(table.email, email))
    .limit(1);

  if (duplicateUser) {
    return res.status(409).json({ success: false, message: "Duplicate email" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const result = await db
    .insert(usersTable)
    .values({ name, email, password: hashedPwd })
    .returning();

  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }

  let n8nEmailStatus = "success";
  try {
    const n8nResponse = await axios.post(process.env.N8N_POST_URL, result);
    if (!n8nResponse) {
      n8nEmailStatus = "error";
    }
  } catch (error) {
    console.log(error);
    n8nEmailStatus = "error";
  }

  res.status(201).json({
    success: true,
    message: "User created successfully!",
    n8nEmailStatus: n8nEmailStatus,
  });
};
