import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { Diagnosis, Gender, Patient } from "../../types";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import EntryDetails from "./EntryDetails";
import { Alert, Button } from "@mui/material";
import EntryForm from "./EntryForm";

const PatientInfo = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient>();
  const [addVisible, setAddVisible] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  useEffect(() => {
    if (id) {
      patientService.get(id).then((patient) => setPatient(patient));
    }

    diagnosisService.getAll().then((diagnoses) => {
      setDiagnoses(diagnoses);
    });
  }, [id]);

  const handleAdd = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setAddVisible(true);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {patient && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <h1 style={{ display: "inline" }}>{patient.name}</h1>
            {patient.gender === Gender.Male && <MaleIcon />}
            {patient.gender === Gender.Female && <FemaleIcon />}
          </div>
          <div>ssh: {patient.ssn}</div>
          <div>occupation: {patient.occupation}</div>
          {error && <Alert severity="error">{error}</Alert>}
          {addVisible && (
            <EntryForm
              setVisible={setAddVisible}
              diagnoses={diagnoses}
              patientId={patient.id}
              setPatient={setPatient}
              showError={showError}
            />
          )}
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
          <Button
            variant="contained"
            style={{ marginTop: 8 }}
            onClick={handleAdd}
          >
            add entry
          </Button>
        </>
      )}
    </>
  );
};

export default PatientInfo;
