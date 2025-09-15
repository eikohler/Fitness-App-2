import { StyleSheet } from "react-native";

export const colors = {
    mainBG: "#0D0D0D",
    black: "#000",
    white: "#fff",
    softWhite: "#BCC2E1",
    primaryText: "#ffffff",
    secondText: "#BCC2E1",
    darkBlue: "#000074",
    arrowButtonBG: "#000074",
    firstSetBG: "#000074",
    secondSetBG: "#BCC2E1",
    plusButtonBG: "#BCC2E1",
    weekText: "#A486FF",
    largeButtonBG: "#0059FF",
    modalBG: "#000074",
};


export const fonts = {
    mainFont: "Inter"
};


export const mainStyles = StyleSheet.create({
    wrapper: {
        width: "90%",
        marginHorizontal: "auto",
        display: "flex",
        justifyContent: "space-between",
        gap: 50,
        paddingBottom: 50,
        flexGrow: 1,
    },
    buttonsWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10
    },
    buttonsList: {
        paddingTop: 10,
        display: "flex",
        gap: 25
    },
    editButtonsList: {
        paddingTop: 10,
        display: "flex",
        gap: 40,
        backgroundColor: 'red'
    },
    focusedWrapper: {
        paddingBottom: "80%"
    },
    modalWrapper: {
        backgroundColor: colors.modalBG,
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        overflow: "hidden"
    }
});


export const arrowButton = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.arrowButtonBG,
        paddingTop: 10,
        paddingBottom: 8,
        paddingHorizontal: 12,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        flex: 1
    },
    title: {
        color: colors.primaryText,
        fontSize: 20,
        // textTransform: "uppercase",
        fontWeight: 600,
        fontFamily: fonts.mainFont
    },
    subText: {
        color: colors.secondText,
        textTransform: "uppercase",
        marginBottom: 4,
        fontSize: 12,
        fontFamily: fonts.mainFont
    }
});


export const toggleButton = StyleSheet.create({
    wrapper: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primaryText,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1 / 1
    },
    text: {
        color: colors.primaryText,
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: 18,
        fontFamily: fonts.mainFont
    }
});

export const editButton = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    content: {
        display: "flex",
        gap: 10,
        flex: 1,
    },
    titleWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    title: {
        fontFamily: fonts.mainFont,
        color: colors.primaryText,
        fontWeight: 600,
        fontSize: 24
    },
    notesWrapper: {
        borderRadius: 10,
        borderColor: colors.primaryText,
        borderWidth: 1,
        padding: 10,
        backgroundColor: colors.modalBG
    },
    notes: {
        fontFamily: fonts.mainFont,
        color: colors.primaryText,
        padding: 0,
        fontSize: 18
    },
    settingsWrapper: {
        display: "flex",
        flexDirection: "row",
        gap: 6
    },
    setting: {
        flex: 1,
        display: "flex",
        gap: 5,
    },
    inputWrapper: {
        borderRadius: 10,
        borderColor: colors.primaryText,
        borderWidth: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 8
    },
    inputText: {
        fontFamily: fonts.mainFont,
        color: colors.primaryText,
        fontWeight: 500,
        fontSize: 28,
        textTransform: "uppercase",
    },
    inputTitle: {
        fontFamily: fonts.mainFont,
        color: colors.primaryText,
        fontSize: 14,
        textTransform: "uppercase",
        textAlign: 'center'
    },
    dividerLine: {
        width: "100%",
        borderColor: colors.primaryText,
        borderBottomWidth: 1,
    },
    icons: {
        paddingTop: 40
    },
});