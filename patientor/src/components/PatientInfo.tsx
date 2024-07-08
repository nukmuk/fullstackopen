import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import { Gender, Patient } from "../types";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

const PatientInfo = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    if (!id) return;
    patientService.get(id).then((patient) => setPatient(patient));
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
          {patient.entries.map((entry) => {
            return (
              <div>
                {entry.date} <i>{entry.description}</i>
                <ul>
                  {entry.diagnosisCodes?.map((code) => (
                    <li>{code}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default PatientInfo;
