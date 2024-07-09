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

router.post("/:id/entries", (req, res) => {
  try {
    const id = req.params.id;
    const body: unknown = req.body;
    const patient = patientService.getPatient(id);
    if (!patient) return res.status(404).json({ error: "patient not found" });
    const newEntry = patientService.addEntry(patient, body);
    return res.status(201).json(newEntry);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).json({ error: e.message });
    } else {
      console.error("error not instanceof Error", e);
      return res.status(400).json({ error: String(e) });
    }
  }
});

export default router;
