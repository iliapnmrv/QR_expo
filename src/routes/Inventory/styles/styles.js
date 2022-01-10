import { StyleSheet } from "react-native";

//Styles
export const styles = StyleSheet.create({
  none: {
    display: "none",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#A9A9A9",
    padding: 10,
    alignSelf: "center",
    width: "90%",
    marginLeft: 10,
  },
  modalCenter: {
    marginBottom: 15,
    marginTop: 10,
  },
  sessionInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  sessionInfoButtons: {
    justifyContent: "center",
  },

  analyzeBtn: {
    alignSelf: "flex-end",
  },

  scanData: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingBottom: 5,
  },

  info: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  biggerFont: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    alignItems: "center",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5,
  },
  active: {
    color: "#28a745",
  },
  danger: {
    color: "#dc3545",
  },
  accept: {
    backgroundColor: "#28a745",
  },
  reject: {
    backgroundColor: "#dc3545",
  },
  btnTextStyle: {
    color: "white",
  },
  modalView: {
    justifyContent: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "80%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 5,
    justifyContent: "center",
    textAlign: "center",
  },
  containerText: {
    textAlign: "center",
    width: "100%",
  },
  maintext: {
    fontSize: 20,
    textAlign: "center",
    padding: 1,
  },

  itemsRemain: {
    marginBottom: 10,
  },
  // цвета статусов
  green: {
    color: "#28a745",
  },
  red: {
    color: "#dc3545",
  },
  blue: {
    color: "#85C1E9",
  },
  yellow: {
    color: "#F1C40F",
  },
  lightGreen: {
    backgroundColor: "#ddfada",
  },
  lightRed: {
    backgroundColor: "#ffe7e6",
  },
  lightBlue: {
    backgroundColor: "#eafbff",
  },
  lightYellow: {
    backgroundColor: "#ffffeb",
  },
});
