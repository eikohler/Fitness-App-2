import { StyleSheet } from "react-native";

export const colors = {
    primaryText: "#BCC2E1",
    arrowButtonBG: "#0D0D46",
    weekText: "#6363FF",
    largeButtonBG: "#3030EF"
};


export const fonts = {
    mainFont: "Inter"
}


export const mainStyles = StyleSheet.create({
    wrapper: {
        width: "90%",
        marginHorizontal: "auto",
        paddingTop: 80,
        paddingBottom: 50,
        display: "flex",
        gap: 40,
        height: "100%"
    },
    buttonsWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10
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
        fontSize: 22,
        textTransform: "uppercase",
        fontWeight: 600
    },
    subText: {
        color: colors.primaryText,
        textTransform: "uppercase",
        marginBottom: 4,
        fontSize: 12
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
        aspectRatio: 1/1
    },
    text: {
        color: colors.primaryText,
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: 18
    }
});


export const largeButton = StyleSheet.create({    
    wrapper: {
        borderRadius: 35,
        backgroundColor: colors.largeButtonBG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 32,
        width: "90%",
        marginHorizontal: "auto",
        boxShadow: "-10 10 1 #000"
    },
    text: {
        color: colors.primaryText,
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: 25,
        letterSpacing: 1
    }
});