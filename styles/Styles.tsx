import { StyleSheet } from "react-native";

export const colors = {
    mainBG: "#0D0D0D",
    primaryText: "#ffffff",
    secondText: "#BCC2E1",
    backButtonBG: "#BCC2E1",
    arrowButtonBG: "#000074",
    weekText: "#6363FF",
    largeButtonBG: "#0059FF"
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
        gap: 25,
        height: "100%"
    },
    buttonsWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10
    },
    buttonsList: {
        display: "flex",
        gap: 18
    },
    buttonsDivider: {
        flex: 1,
        display: "flex",
        justifyContent: "space-between"
    }
});

export const backButton = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.backButtonBG,
        boxShadow: "-4 4 0 rgba(188, 194, 225, 0.28)",
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        marginBottom: 6
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
        textTransform: "uppercase",
        fontWeight: 600
    },
    subText: {
        color: colors.secondText,
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
        borderRadius: 32,
        backgroundColor: colors.largeButtonBG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 30,
        width: "80%",
        marginHorizontal: "auto",
        boxShadow: "-10 10 0 #000000"        
    },
    text: {
        color: colors.primaryText,
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: 22,
        letterSpacing: 1
    }
});