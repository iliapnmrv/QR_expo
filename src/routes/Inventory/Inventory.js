import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./styles/styles.js";
import { SCAN_STATUS_COLOR, today } from "constants/constants";
import ScanButton from "components/Buttons/ScanButton";
import ScanData from "components/ScanData/ScanData";
import {
  toggleCloseSessionModal,
  toggleScanModal,
} from "store/actions/inventory/modalAction.js";
import { generalStyles } from "../../styles/base/general.js";
import Title from "../../components/Title/Title.js";
import PageHeader from "../../components/PageHeader/PageHeader.js";
import SessionData from "../../components/SessionData/SessionData.js";
import DBService from "../../services/db.service.js";
import {
  setSessionDate,
  setSessionStatus,
} from "../../store/actions/inventory/sessionAction.js";
import CustomButton from "../../components/Buttons/CustomButton.js";
import { analyze } from "services/inventory.service.js";

function Inventory({ navigation }) {
  const dispatch = useDispatch();

  const { data } = useSelector(({ docs }) => docs.scan);

  const onSessionChangeHandler = (status) => {
    if (status) {
      dispatch(setSessionDate(`Сессия еще не была открыта`));
    } else {
      dispatch(setSessionDate(`Сессия была открыта: ${today}`));
    }
    dispatch(setSessionStatus(!status));
  };

  const { status } = useSelector(({ inventory }) => inventory.session);
  const { remains } = useSelector(({ inventory }) => inventory.scan);
  const { scanModal, closeSessionModal } = useSelector(
    ({ inventory }) => inventory.modals
  );
  const { scanStatus, scanResult } = useSelector(
    ({ inventory }) => inventory.scanResult
  );

  return (
    <>
      <ScrollView>
        <View style={[generalStyles.page, { paddingBottom: 20 }]}>
          <PageHeader text="Инвентаризация" />

          <SessionData />

          <View>
            <ScanButton navigation={navigation} prevScreen="inventory" />
            <Title title="Сканирование" />
            <ScanData />
          </View>

          {/* Результаты анализирования */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={scanModal}
              onRequestClose={() => {
                dispatch(toggleScanModal(!scanModal));
              }}
            >
              <View style={styles.centeredView}>
                <View
                  style={[
                    styles.modalView,
                    styles[SCAN_STATUS_COLOR.modal[scanStatus]],
                  ]}
                >
                  <Text
                    style={[
                      styles.maintext,
                      styles[SCAN_STATUS_COLOR.text[scanStatus]],
                    ]}
                  >
                    {scanStatus}
                  </Text>
                  {scanResult ? (
                    <Text style={styles.maintext}>{scanResult}</Text>
                  ) : null}
                  {remains ? (
                    <Text style={[styles.maintext, styles.itemsRemain]}>
                      {remains}
                    </Text>
                  ) : null}
                  <View style={styles.buttons}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        scanStatus == "В учете" ? styles.accept : styles.reject,
                      ]}
                      onPress={() => {
                        dispatch(toggleScanModal(!scanModal));
                      }}
                    >
                      <Text style={styles.btnTextStyle}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          {/* Подтверждение закрытия сессии */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={closeSessionModal}
              onRequestClose={() => {
                dispatch(toggleCloseSessionModal(!closeSessionModal));
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.maintext}>
                    Вы точно хотите закрыть инвентаризационную сессию?
                  </Text>
                  <View style={styles.buttons}>
                    <TouchableOpacity
                      style={[styles.button, styles.accept]}
                      onPress={() => {
                        dispatch(toggleCloseSessionModal(!closeSessionModal));
                        onSessionChangeHandler(status);
                        DBService.sessionClose();
                      }}
                    >
                      <Text style={styles.btnTextStyle}>Да, закрыть</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.reject]}
                      onPress={() => {
                        dispatch(toggleCloseSessionModal(!closeSessionModal));
                      }}
                    >
                      <Text style={styles.btnTextStyle}>Отменить</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
      {data !== null ? (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
            width: "100%",
            paddingHorizontal: 15,
          }}
        >
          <CustomButton
            onPress={() => analyze(data)}
            type="PRIMARY"
            text="Найти в ведомости"
          />
        </View>
      ) : null}
    </>
  );
}

export default Inventory;
