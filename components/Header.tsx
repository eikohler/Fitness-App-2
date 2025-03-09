import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';

export default function Header(props: { title: string, subtext: string }) {

    const { title, subtext } = props;

    return (
        <View style={styles.wrapper}>
            <Text style={styles.subtext}>{subtext}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: "90%",
        marginHorizontal: "auto",
        paddingTop: 100,
    },
    title: {
        color: colors.primaryText,
        fontSize: 30,
        textTransform: "uppercase",
        fontWeight: "900",
        fontStyle: "italic",
        fontFamily: fonts.mainFont,
        letterSpacing: -3
    },
    subtext: {
        fontFamily: fonts.mainFont,
        color: colors.primaryText,
        textTransform: "uppercase",
        fontSize: 16
    },
});