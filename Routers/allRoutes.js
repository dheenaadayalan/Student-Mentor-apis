import express from "express";
import {
  addMentor,
  createMentor,
  createStudent,
  getMentorNames,
  getStudentNames,
  updateMentor,
} from "../Controllers/allController.js";

const router = express.Router();

router.post("/create/student", createStudent);
router.post("/create/mentor", createMentor);
router.post("/add/mentor", addMentor);
router.post("/update/mentor", updateMentor);
router.get("/getMentor/:id", getStudentNames);
router.get("/getStudent/:id", getMentorNames);

export default router;
