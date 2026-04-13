
import express from "express";
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole
} from "../controllers/roles.controllers.js";



import { validateRole } from "../middlewares/validateRoles.js";

const router = express.Router();

router.post("/", validateRole, createRole);
router.get("/", getAllRoles);
router.put("/:id", validateRole, updateRole);
router.delete("/:id", deleteRole);

export default router;
