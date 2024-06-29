import { useSelector } from "react-redux";
import "./Notifications.css";

export const Notifications = () => {
  const notifications = useSelector((state) => state.notifications);
  console.log("notifications:", notifications);
  return (
    <>
      {notifications.map((n) => {
        return (
          <h3
            key={n.index}
            className={`notification ${n.error ? "error" : null}`}
          >
            {n.message}
          </h3>
        );
      })}
    </>
  );
};
