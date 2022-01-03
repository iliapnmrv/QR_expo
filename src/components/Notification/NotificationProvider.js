import React, { createContext, useReducer } from "react";
import Notification from "./Notification";

export const NotificationContext = createContext();

export default function NotificationProvider(props) {
  const [state, dispatchNotification] = useReducer((state, action) => {
    switch (action.type) {
      case "ADD_NOTIFICATION":
        return [...state, { ...action.payload }];

      case "REMOVE_NOTIFICATION":
        return state.filter((el) => el.id !== action.id);

      default:
        return state;
    }
  }, []);

  return (
    <NotificationContext.Provider value={dispatchNotification}>
      <div>
        <div className="notification-wrapper">
          {state.map((note) => {
            return (
              <Notification
                dispatch={dispatchNotification}
                key={note.id}
                {...note}
              />
            );
          })}
        </div>
        {props.children}
      </div>
    </NotificationContext.Provider>
  );
}
