import ReactDOM from "react-dom/client";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import notificationsReducer from "./reducers/notificationsReducer";

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});

console.log("store:", store.getState());

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
