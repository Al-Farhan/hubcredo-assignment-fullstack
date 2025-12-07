import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { usersTable } from "../models/User.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

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

  const [foundUser] = await db
    .select()
    .from(usersTable)
    .where((table) => eq(table.email, email))
    .limit(1);

  if (!foundUser) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const matchPassword = await bcrypt.compare(password, foundUser.password);

  if (!matchPassword)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: { name: foundUser.name, email: foundUser.email },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
  });

  res.json({ accessToken });
};

export const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
