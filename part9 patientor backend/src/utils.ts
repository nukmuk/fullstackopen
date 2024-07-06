import { Gender, NewPatient } from "./types";

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object")
    throw new Error("Incorrect or missing data");

  if (
    "name" in object &&
    "ssn" in object &&
    "dateOfBirth" in object &&
    "occupation" in object &&
    "gender" in object
  ) {
    const newPatient = {
      name: parseString(object.name, "name"),
      ssn: parseString(object.ssn, "ssn"),
      dateOfBirth: parseString(object.dateOfBirth, "dateOfBirth"),
      occupation: parseString(object.occupation, "occupation"),
      gender: parseGender(object.gender),
    };
    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
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
