import "./Notifications.css";

export const Notifications = (props) => {
  return (
    <>
      {props.notifications.map((n) => {
        return (
          <h3 className={`notification ${n.error ? "error" : null}`}>
            {n.message}
          </h3>
        );
      })}
    </>
  );
};

const Notification = () => {};
