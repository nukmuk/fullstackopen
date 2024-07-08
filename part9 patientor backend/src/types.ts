export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Entry = {};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
};

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type NewPatient = Omit<Patient, "id">;
