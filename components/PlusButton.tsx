import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';

export default function PlusButton(props: { onPress?: () => void, modal?: boolean, textFocused?: number }) {

    const { onPress, modal, textFocused } = props;

    return (
        <View style={[styles.wrapper, {opacity: textFocused !== undefined && textFocused > -1 ? 0 : 1}]}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={[styles.text, {color: modal ? colors.modalBG : colors.mainBG}]}>+</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
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