import express from "express";
import patientService from "../services/patientService";
import { toNewPatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const patient = patientService.getPatient(id);
  if (!patient) res.status(404).json({ error: "not found" });
  res.json(patient);
});

router.post("/", (req, res) => {
  try {
    const body: unknown = req.body;
    const newPatient = toNewPatient(body);
    const patient = patientService.addPatient(newPatient);
    res.status(201).json(patient);
  } catch (e) {
    res.status(400).json(e);
  }
});

export default router;
