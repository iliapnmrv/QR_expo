import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SESSIONS_INFO, today } from "constants/constants";
import { styles } from "../../routes/Inventory/styles/styles";
import {
  setSessionDate,
  setSessionStatus,
} from "store/actions/inventory/sessionAction.js";
import { toggleCloseSessionModal } from "store/actions/inventory/modalAction.js";
import DBService from "../../services/db.service";

export default function SessionData() {
  const dispatch = useDispatch();
  const { status, date } = useSelector(({ inventory }) => inventory.session);
  const { downloadLinkModal } = useSelector(
    ({ inventory }) => inventory.modals
  );

  const onSessionChangeHandler = (status) => {
    if (status) {
      dispatch(setSessionDate(`Сессия еще не была открыта`));
    } else {
      dispatch(setSessionDate(`Сессия была открыта: ${today}`));
    }
    dispatch(setSessionStatus(!status));
  };

  return (
    <>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text>{date}</Text>
      </View>
      <View style={styles.sessionInfo}>
        <Text style={status ? styles.active : styles.danger}>
          {SESSIONS_INFO[status].info}
        </Text>
        <Button
          title={SESSIONS_INFO[status].button}
          onPress={() => {
            status
              ? dispatch(toggleCloseSessionModal(true))
              : (DBService.download(), onSessionChangeHandler(status));
          }}
        />
      </View>
    </>
  );
}
