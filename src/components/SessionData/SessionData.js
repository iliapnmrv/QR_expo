import React from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SESSIONS_INFO, today } from "constants/constants";
import { styles } from "../../routes/Inventory/styles/styles";
import {
  setDownloadUrl,
  setSessionDate,
  setSessionStatus,
} from "store/actions/inventory/sessionAction.js";
import {
  toggleCloseSessionModal,
  toggleDownloadLinkModal,
  toggleScanModal,
} from "store/actions/inventory/modalAction.js";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Clipboard from "expo-clipboard";
import DBService from "../../services/db.service";

export default function SessionData() {
  const dispatch = useDispatch();
  const { status, date, url } = useSelector(
    ({ inventory }) => inventory.session
  );
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

  const insertTextFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    dispatch(setDownloadUrl(text));
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
              : (DBService.download(url), onSessionChangeHandler(status));
          }}
        />
        {!status ? (
          <Icon
            name="edit"
            size={25}
            color="#A9A9A9"
            onPress={() => {
              dispatch(toggleDownloadLinkModal(true));
            }}
          />
        ) : null}
        <Modal
          animationType="slide"
          transparent={true}
          visible={downloadLinkModal}
          onRequestClose={() => {
            dispatch(toggleDownloadLinkModal(!downloadLinkModal));
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.maintext}>Введите ссылку для скачивания</Text>
              <View style={[styles.buttons, styles.modalCenter]}>
                <Icon
                  name="clipboard"
                  size={30}
                  color="#A9A9A9"
                  onPress={() => {
                    insertTextFromClipboard();
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder={url}
                  onChangeText={(text) => {
                    dispatch(setDownloadUrl(text));
                  }}
                  value={url}
                />
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.button, styles.accept]}
                  onPress={() => {
                    dispatch(setDownloadUrl(url));
                    dispatch(toggleDownloadLinkModal(!downloadLinkModal));
                  }}
                >
                  <Text style={styles.btnTextStyle}>Сохранить</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.reject]}
                  onPress={() => {
                    dispatch(toggleDownloadLinkModal(!downloadLinkModal));
                  }}
                >
                  <Text style={styles.btnTextStyle}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
