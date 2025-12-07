import express from "express";
import { createNewUser } from "../controllers/usersController.js";

const router = express.Router();

router.route("/").post(createNewUser);

export default router;
