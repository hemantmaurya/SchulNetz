import express from "express";
import { testingSave, getTestingAll, testingUpdate, testingDelete } from "../controllers/testing.controller.js";
import { validateSaveTesting } from "../middlewares/validateTesting.js";

const router = express.Router();

router.post("/", validateSaveTesting, testingSave);      // Add with validation
router.get("/", getTestingAll);                          // List
router.put("/:id", validateSaveTesting, testingUpdate);  // Edit with validation
router.delete("/:id", testingDelete);                    // Delete

export default router;
