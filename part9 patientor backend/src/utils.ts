import {
  Diagnosis,
  Discharge,
  Entry,
  EntryWithoutId,
  Gender,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  NewPatient,
  NonSensitivePatient,
  OccupationalHealthcareEntry,
  Patient,
  SickLeave,
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

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object")
    throw new Error("Incorrect or missing data");

  if ("type" in object) {
    switch (object.type) {
      case "Hospital":
        return parseHospitalEntry(object);
      case "HealthCheck":
        return parseHealthCheckEntry(object);
      case "OccupationalHealthcare":
        return parseOccupationalHealthcareEntry(object);
      default:
        throw new Error("invalid entry type");
    }
  }
  throw new Error("missing entry ytpe");
};

const parseHospitalEntry = (object: object): Omit<HospitalEntry, "id"> => {
  if (
    !(
      "date" in object &&
      "description" in object &&
      "specialist" in object &&
      "type" in object &&
      "diagnosisCodes" in object &&
      "discharge" in object
    )
  )
    throw new Error("missing required fields");
  return {
    date: parseStringNotEmpty(object.date, "date"),
    description: parseString(object.description, "description"),
    discharge: object.discharge as Discharge,
    specialist: parseString(object.specialist, "specialist"),
    type: "Hospital",
    diagnosisCodes: parseDiagnosisCodes(object),
  };
};

const parseHealthCheckEntry = (
  object: object
): Omit<HealthCheckEntry, "id"> => {
  if (
    !(
      "date" in object &&
      "description" in object &&
      "specialist" in object &&
      "type" in object &&
      "diagnosisCodes" in object &&
      "healthCheckRating" in object
    )
  )
    throw new Error("missing required fields");
  return {
    date: parseStringNotEmpty(object.date, "date"),
    description: parseString(object.description, "description"),
    specialist: parseString(object.specialist, "specialist"),
    type: "HealthCheck",
    diagnosisCodes: parseDiagnosisCodes(object),
    healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
  };
};

const parseOccupationalHealthcareEntry = (
  object: object
): Omit<OccupationalHealthcareEntry, "id"> => {
  if (
    !(
      "date" in object &&
      "description" in object &&
      "specialist" in object &&
      "type" in object &&
      "diagnosisCodes" in object &&
      "sickLeave" in object &&
      "employerName" in object
    )
  )
    throw new Error("missing required fields");

  return {
    date: parseStringNotEmpty(object.date, "date"),
    description: parseString(object.description, "description"),
    specialist: parseString(object.specialist, "specialist"),
    type: "OccupationalHealthcare",
    diagnosisCodes: parseDiagnosisCodes(object),
    employerName: parseString(object.employerName, "employer"),
    sickLeave: object.sickLeave as SickLeave,
  };
};

const parseHealthCheckRating = (value: unknown): HealthCheckRating => {
  switch (Number(value)) {
    case 0:
      return HealthCheckRating.Healthy;
    case 1:
      return HealthCheckRating.LowRisk;
    case 2:
      return HealthCheckRating.HighRisk;
    case 3:
      return HealthCheckRating.CriticalRisk;
    default:
      throw new Error(`invalid healthcheck rating: ${value}`);
  }
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const parseString = (object: unknown, fieldName: string): string => {
  if (isString(object)) return object;
  throw new Error(
    `field with name ${fieldName} is not string: ${JSON.stringify(object)}`
  );
};

const parseStringNotEmpty = (object: unknown, fieldName: string): string => {
  if (!isString(object))
    throw new Error(`field with name ${fieldName} is not string: ${object}`);
  if (object.length === 0)
    throw new Error(`field with name ${fieldName} is empty`);
  return object;
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
