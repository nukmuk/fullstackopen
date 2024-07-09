import {
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Diagnosis, EntryWithoutId, Patient } from "../../../types";
import React, { useState } from "react";
import patientService from "../../../services/patients";
import axios from "axios";

type Props = {
  diagnoses: Diagnosis[];
  patientId: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  showError: (message: string) => void;
};

const HospitalForm = ({
  diagnoses,
  patientId,
  setPatient,
  showError,
}: Props) => {
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<
    Array<Diagnosis["code"]>
  >([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const data = {
        type: "Hospital",
        description: form.description.value,
        date: form.date.value,
        specialist: form.specialist.value,
        diagnosisCodes: selectedDiagnoses,
        discharge: {
          date: form["discharge-date"].value,
          criteria: form["discharge-criteria"].value,
        },
      } as EntryWithoutId;
      console.log("data", data);
      const newEntry = await patientService.addEntry(patientId, data);
      setPatient((prev) => {
        if (!prev) return prev;
        return { ...prev, entries: prev.entries.concat(newEntry) };
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error", error);
        showError(error.response?.data.error);
      } else {
        console.error(error);
      }
    }
  };

  if (!diagnoses) return <div>loading</div>;
  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}
      id="add-form"
    >
      <TextField id="description" label="Description" variant="standard" />
      <br />
      date
      <Input type="date" id="date" />
      <TextField id="specialist" label="Specialist" variant="standard" />
      <br />
      <InputLabel id="selected-diagnoses-label">Diagnoses</InputLabel>
      <Select
        labelId="selected-diagnoses-label"
        id="selected-diagnoses"
        multiple
        value={selectedDiagnoses}
        onChange={(e) => {
          const value = e.target.value as string[];
          setSelectedDiagnoses(value);
        }}
        input={<OutlinedInput label="Name" />}
      >
        {diagnoses.map((diagnosis) => (
          <MenuItem key={diagnosis.code} value={diagnosis.code}>
            {diagnosis.code}
          </MenuItem>
        ))}
      </Select>
      <br />
      discharge date
      <Input type="date" id="discharge-date" />
      <TextField
        id="discharge-criteria"
        label="Discharge criteria"
        variant="standard"
      />
    </form>
  );
};

export default HospitalForm;
