import express from "express";
import { saveAcademic, getAcademicAll, updateAcademic, deleteAcademic } from "../controllers/academicCalendar.controller.js";
import { validateAcademic } from "../middlewares/validateAcademic.js";

const router = express.Router();

router.post("/", validateAcademic, saveAcademic);
router.put("/:id", validateAcademic, updateAcademic);

router.post("/", saveAcademic);
router.get("/", getAcademicAll);
router.put("/:id", updateAcademic);
router.delete("/:id", deleteAcademic);

export default router;