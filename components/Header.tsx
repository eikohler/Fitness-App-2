import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useRef } from 'react';
import { colors, fonts, headerHeight, wrapperPaddingHorizontal } from '@/styles/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Header({
    title,
    btnText,
    showWeek,
    btnAction,
    cancel
}: {
    title?: string;
    btnText: string;
    showWeek?: boolean;
    btnAction: () => void;
    cancel?: () => void;
}) {
    const fixedTitle = title?.replace(" ", "  ");

    const headerRef = useRef<any>(null);

    const navigation = useNavigation();

    return (
        <View ref={headerRef} style={[styles.container, {
            boxShadow: "0px 0px 5px rgba(13, 13, 13, 1)",
            height: headerHeight
        }]}>
            <LinearGradient colors={['#000048', 'rgba(13, 13, 13, 0.925)']}
                style={[styles.gradient]} />
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <View>
                        {showWeek && (
                            <View style={styles.weekWrapper}>
                                <Text style={styles.weekText}>WEEK 3</Text>
                                <MaterialIcons name="bolt" size={18} color={colors.brightPurple} />
                            </View>
                        )}
                        {fixedTitle && (
                            <Text style={styles.title}>{fixedTitle}</Text>
                        )}
                        {cancel && (
                            <Pressable style={styles.cancelWrapper} onPress={cancel}>
                                <View style={styles.cancelArrow}>
                                    <FontAwesome5 name="arrow-left" size={16} color={colors.darkBlue} />
                                </View>
                                <Text style={styles.cancelText}>CANCEL</Text>
                            </Pressable>
                        )}
                    </View>
                    <Pressable style={styles.button} onPress={btnAction}>
                        <Text style={styles.buttonText}>{btnText}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100%"
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%"
    },
    wrapper: {
        paddingHorizontal: wrapperPaddingHorizontal,
        paddingBottom: 10,
        display: "flex",
        flexDirection: 'row',
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: "100%"
    },
    content: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "100%",
        gap: 15
    },
    title: {
        color: colors.white,
        fontSize: 24,
        textTransform: "uppercase",
        fontWeight: "900",
        fontStyle: "italic",
        fontFamily: fonts.mainFont,
        marginBottom: -6,
        letterSpacing: -3
    },
    button: {
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12
    },
    buttonText: {
        color: colors.darkBlue,
        fontWeight: 700,
        fontSize: 18,
        textTransform: "uppercase"
    },
    weekWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    weekText: {
        color: colors.brightPurple,
        fontSize: 16
    },
    cancelWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        gap: 10
    },
    cancelArrow: {
        backgroundColor: colors.white,
        borderRadius: 100,
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    cancelText: {
        color: colors.white,
        fontWeight: 700,
        fontSize: 20
    }
});