import patientData from "../../data/patients";
import { Entry, NewPatient, NonSensitivePatient, Patient } from "../types";
import { v1 as uuid } from "uuid";
import { toNewEntry, toNonSensitivePatient } from "../utils";

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient | null => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) return null;
  return patient;
};

const getNonSensitivePatient = (id: string): NonSensitivePatient | null => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) return null;
  return toNonSensitivePatient(patient);
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((patient: Patient) => toNonSensitivePatient(patient));
};

const addPatient = (newPatient: NewPatient): Patient => {
  const id = uuid();
  const patient = {
    id,
    ...newPatient,
  };
  patientData.push(patient);
  return patient;
};

const addEntry = (patient: Patient, entry: unknown): Entry => {
  const newEntry: Entry = { ...toNewEntry(entry), id: uuid() };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatient,
  getNonSensitivePatients,
  getNonSensitivePatient,
  addPatient,
  addEntry,
};
