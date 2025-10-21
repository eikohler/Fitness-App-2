import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useRef } from 'react';
import { colors, fonts } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Header({
    title,
    subtext,
    bolt,
    backBtn,
    editURL
}: {
    title: string;
    subtext: string;
    bolt?: boolean;
    backBtn?: boolean;
    editURL?: Href;
}) {

    const fixedTitle = title.replace(" ", "  ");

    const headerRef = useRef<any>(null);

    const navigation = useNavigation();

    return (
        <View ref={headerRef} style={[styles.container, {
            boxShadow: "0px 0px 5px rgba(13, 13, 13, 1)",
        }]}>
            <LinearGradient colors={['#000048', 'rgba(13, 13, 13, 0.925)']}
                style={[styles.gradient]} />
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    {backBtn &&
                        <Pressable style={{ marginBottom: 3 }} onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={32} color={colors.secondText} />
                        </Pressable>
                    }
                    <View>
                        {/* <View style={styles.subTextWrapper}>
                                <Text style={[styles.subText, bolt && { marginRight: -2, color: colors.weekText }, { color: colors.primaryText }]}>{subtext}</Text>
                                {bolt && <MaterialIcons name="bolt" size={18} color={colors.weekText} />}
                            </View> */}
                        <Text style={styles.title}>{fixedTitle}</Text>
                    </View>
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
        width: "100%",
        height: 100
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%"
    },
    wrapper: {
        paddingBottom: 5,
        paddingHorizontal: 15,
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
        gap: 15
    },
    title: {
        color: colors.primaryText,
        fontSize: 24,
        textTransform: "uppercase",
        fontWeight: "900",
        fontStyle: "italic",
        fontFamily: fonts.mainFont,
        letterSpacing: -3
    },
    subTextWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    subText: {
        fontFamily: fonts.mainFont,
        color: colors.secondText,
        textTransform: "uppercase",
        fontSize: 16,
    }
});