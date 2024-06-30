import { useSelector } from "react-redux";
import "./Notifications.css";
import { Alert } from "@mui/material";

export const Notifications = () => {
  const notifications = useSelector((state) => state.notifications);
  console.log("notifications:", notifications);
  return (
    <>
      {notifications.map((n) => {
        return (
          <Alert
            key={n.index}
            severity={n.error ? "error" : "success"}
            // className={`notification ${n.error ? "error" : null}`}
          >
            {n.message}
          </Alert>
        );
      })}
    </>
  );
};
