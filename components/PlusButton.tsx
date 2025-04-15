import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';

export default function PlusButton(props: { onPress: () => void, modal?: boolean }) {

    const { onPress, modal } = props;

    return (
        <Pressable style={styles.wrapper} onPress={onPress}>
            <View style={styles.button}>
                <Text style={[styles.text, {color: modal ? colors.modalBG : colors.mainBG}]}>+</Text>
            </View>
        </Pressable>
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