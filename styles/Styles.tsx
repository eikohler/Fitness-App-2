import { StyleSheet } from "react-native";

export const colors = {
    primaryText: "#BCC2E1",
    arrowButtonBG: "#171775",
    weekText: "#6363FF"
};

export const fonts = {
    mainFont: "Inter"
}

export const mainStyles = StyleSheet.create({
    wrapper: {
        width: "90%",
        marginHorizontal: "auto"    
    },
    buttonsWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10
    },
    arrowButton: {
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
    arrowButtonTitle: {
        color: colors.primaryText,
        fontSize: 22,
        textTransform: "uppercase",
        fontWeight: 600
    },
    arrowButtonSubText: {
        color: colors.primaryText,
        textTransform: "uppercase",
        marginBottom: 4,
        fontSize: 12
    },
    toggleButton: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primaryText,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1/1
    },
    toggleButtonText: {
        color: colors.primaryText,
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: 18
    }
});