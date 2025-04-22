import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Get all users for the sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages between users
router.get("/:userId", protectRoute, getMessages);

// Send message to a user
router.post("/send/:userId", protectRoute, sendMessage);

export default router;