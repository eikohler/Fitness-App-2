import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';

export default function PlusButton(props: { modal?: boolean }) {

    const { modal } = props;

    return (
        <View style={styles.wrapper}>
            <View style={styles.button}>
                <Text style={[styles.text, {color: modal ? colors.modalBG : colors.mainBG}]}>+</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10
    },
    button: {
        borderRadius: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 65,
        height: 65,
        backgroundColor: colors.plusButtonBG
    },
    text: {
        fontSize: 50,
        fontFamily: fonts.mainFont,
        marginTop: -8
    }
});