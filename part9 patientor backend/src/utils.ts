import {
  Entry,
  Gender,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "./types";

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object")
    throw new Error("Incorrect or missing data");

  if (
    "name" in object &&
    "ssn" in object &&
    "dateOfBirth" in object &&
    "occupation" in object &&
    "gender" in object &&
    "entries" in object
  ) {
    const newPatient = {
      name: parseString(object.name, "name"),
      ssn: parseString(object.ssn, "ssn"),
      dateOfBirth: parseString(object.dateOfBirth, "dateOfBirth"),
      occupation: parseString(object.occupation, "occupation"),
      gender: parseGender(object.gender),
      entries: object.entries as Entry[],
    };
    return newPatient;
  }
  console.log("error caused by:", object);
  throw new Error("Incorrect data: some fields are missing");
};

export const toNonSensitivePatient = (
  patient: Patient
): NonSensitivePatient => {
  const { id, name, dateOfBirth, occupation, gender } = patient;
  return { id, name, dateOfBirth, occupation, gender };
};

const parseString = (object: unknown, fieldName: string): string => {
  if (isString(object)) return object;
  throw new Error(`incorrect ${fieldName}`);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender))
    throw new Error(`Incorrect gender: ${gender}`);
  return gender;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
};

const isString = (object: unknown): object is string => {
  return typeof object === "string";
};
