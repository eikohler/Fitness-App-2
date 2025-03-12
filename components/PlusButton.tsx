import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';

export default function PlusButton() {
  return (
    <View style={styles.wrapper}>
        <View style={styles.button}>
            <Text style={styles.text}>+</Text>
        </View>
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
        width: 70,
        height: 70,
        backgroundColor: colors.plusButtonBG
    },
    text: {
        color: colors.mainBG,
        fontSize: 50,
        fontFamily: fonts.mainFont,
        marginTop: -8
    }
});