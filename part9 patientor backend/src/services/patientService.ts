import patientData from "../../data/patients";
import { NonSensitivePatient, Patient } from "../types";

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

export default { getPatients, getNonSensitivePatients };
