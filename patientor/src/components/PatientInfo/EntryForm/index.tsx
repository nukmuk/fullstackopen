import { useState } from "react";
import { Diagnosis, Entry, Patient } from "../../../types";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import HealthCheckForm from "./HealthCheckForm";
import HospitalForm from "./HospitalForm";
import OccupationalHealthcareForm from "./OccupationalHealthcareForm";

type Props = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  diagnoses: Diagnosis[];
  patientId: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  showError: (message: string) => void;
};

const EntryForm = ({
  setVisible,
  diagnoses,
  patientId,
  setPatient,
  showError,
}: Props) => {
  type EntryType = Entry["type"];
  const types: EntryType[] = [
    "Hospital",
    "HealthCheck",
    "OccupationalHealthcare",
  ];
  const [type, setType] = useState<EntryType>(types[0]);

  return (
    <div style={{ outline: "2px black dashed", padding: 8, marginTop: 8 }}>
      <h3>New {type} entry</h3>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        onChange={(event) => setType(event.target.value as EntryType)}
        value={type}
      >
        {types.map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio />}
            label={type}
          />
        ))}
      </RadioGroup>
      {type === types[0] && (
        <HospitalForm
          diagnoses={diagnoses}
          patientId={patientId}
          setPatient={setPatient}
          showError={showError}
        />
      )}
      {type === types[1] && (
        <HealthCheckForm
          diagnoses={diagnoses}
          patientId={patientId}
          setPatient={setPatient}
          showError={showError}
        />
      )}
      {type === types[2] && (
        <OccupationalHealthcareForm
          diagnoses={diagnoses}
          patientId={patientId}
          setPatient={setPatient}
          showError={showError}
        />
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="contained" form="add-form" type="submit">
          add
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setVisible(false)}
        >
          cancel
        </Button>
      </div>
    </div>
  );
};

export default EntryForm;
