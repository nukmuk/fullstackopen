import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { Diagnosis, Gender, Patient } from "../../types";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import EntryDetails from "./EntryDetails";

const PatientInfo = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (id) {
      patientService.get(id).then((patient) => setPatient(patient));
    }

    diagnosisService.getAll().then((diagnoses) => setDiagnoses(diagnoses));
  }, [id]);

  return (
    <>
      {patient && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{ display: "inline" }}>{patient.name}</h1>
            {patient.gender === Gender.Male && <MaleIcon />}
            {patient.gender === Gender.Female && <FemaleIcon />}
          </div>
          <div>ssh: {patient.ssn}</div>
          <div>occupation: {patient.occupation}</div>
          <h2>entries</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {patient.entries.map((entry) => {
              return (
                <EntryDetails
                  entry={entry}
                  key={entry.id}
                  diagnoses={diagnoses}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default PatientInfo;
