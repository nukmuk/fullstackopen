import { Diagnosis, Entry, HealthCheckRating } from "../../types";

import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { assertNever } from "../../utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { styled } from "@mui/material/styles";

type Props = {
  entry: Entry;
  diagnoses: Diagnosis[];
};

const style: React.CSSProperties = {
  border: "1px solid black",
  borderRadius: 4,
  padding: 4,
};

const getHealthColor = (rating: HealthCheckRating): string => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return "green";
    case HealthCheckRating.LowRisk:
      return "yellow";
    case HealthCheckRating.HighRisk:
      return "orange";
    case HealthCheckRating.CriticalRisk:
      return "red";
    default:
      return assertNever(rating);
  }
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
  let employer;
  let extra = null;
  switch (entry.type) {
    case "Hospital":
      employer = <LocalHospitalIcon />;
      break;
    case "OccupationalHealthcare":
      employer = (
        <>
          <WorkIcon />
          {entry.employerName}
        </>
      );
      break;
    case "HealthCheck":
      employer = <MedicalServicesIcon />;
      extra = (
        <FavoriteIcon htmlColor={getHealthColor(entry.healthCheckRating)} />
      );
      break;
    default:
      return assertNever(entry);
  }
  return (
    <div key={entry.id} style={style}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {entry.date} {employer}
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <div>{extra}</div>
      diagnose by {entry.specialist}
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes?.map((code) => (
            <li key={code}>
              {code} {diagnoses.find((d) => d.code === code)?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntryDetails;
