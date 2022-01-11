import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    sectionHeader: {
        fontSize: 18,
        padding: 10,
    },

    itemCell: {
        width: '40%',
        justifyContent: 'center', //Centered horizontally
        alignSelf: "stretch",
        flex: 1,
        paddingRight: 10,
        textAlign: 'center',
    },
    itemCenterCell: {
        width: 350,
    },
    item: {
        paddingTop: 5,
        paddingBottom: 15,
        paddingHorizontal: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        marginTop: 10,
        fontSize: 18,
        width: '100%',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
})