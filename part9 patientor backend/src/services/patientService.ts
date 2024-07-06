import patientData from "../../data/patients";
import { NewPatient, NonSensitivePatient, Patient } from "../types";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ dateOfBirth, gender, id, name, occupation }: Patient) => {
      {
        return {
          id,
          name,
          dateOfBirth,
          gender,
          occupation,
        } as NonSensitivePatient;
      }
    }
  );
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

export default { getPatients, getNonSensitivePatients, addPatient };
