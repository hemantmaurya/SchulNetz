import express from "express";
import {
    createAcademicPost,
    getAcademicPosts,
    updateAcademicPost,
    softDeleteAcademicPost
} from "../controllers/academicController.js";

const router = express.Router();

// Routes
router.post("/", createAcademicPost);           // Create Post
router.get("/", getAcademicPosts);              // Get All Posts with Pagination
router.put("/:id", updateAcademicPost);         // Update Post
router.delete("/:id", softDeleteAcademicPost);  // Soft Delete

export default router;