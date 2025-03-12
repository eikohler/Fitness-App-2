import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';

export default function SetButton() {

  return (
    <View style={styles.wrapper}>
        
        <View style={styles.buttonsWrapper}>            
            <View style={[styles.button, styles.pastSet]}>
                <Text style={styles.title}>1</Text>            
                <Text style={[styles.weight, styles.pastSetText]}>90</Text>
                <Text style={[styles.rir, styles.pastSetText]}>RIR 1</Text>
            </View>
            <Pressable style={[styles.button, styles.newSet]}>
                <Text style={[styles.weight, styles.newSetText]}>75</Text>
                <Text style={[styles.rir, styles.newSetText]}>RIR 3</Text>
            </Pressable>
        </View>

        <Text style={styles.notes}>Weight felt light, can move up 5lbs</Text>
        
    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {       
        display: "flex",
        gap: 8
    },
    title: {
        paddingTop: 6,
        paddingLeft: 8,
        color: colors.secondText,
        fontSize: 14,
        fontFamily: fonts.mainFont,
        position: "absolute",
        top: 0,
        left: 0
    },
    titleText: {
    },
    buttonsWrapper: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    button: {
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 8,
        paddingHorizontal: 12,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        flex: 1,
        gap: 5,        
    },
    pastSet: {
        backgroundColor: colors.pastSetBG,
        position: "relative"  ,
        overflow: "hidden"      
    },
    newSet: {
        backgroundColor: colors.newSetBG        
    },
    weight: {
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: 0.5,
        fontFamily: fonts.mainFont
    },
    rir: {
        letterSpacing: 0.5,
        fontSize: 18,
        marginBottom: 3,
        fontFamily: fonts.mainFont
    },
    pastSetText: {
        color: colors.primaryText
    },
    newSetText: {
        color: colors.mainBG
    },
    notes: {
        color: colors.secondText,
        fontSize: 14,
        fontFamily: fonts.mainFont,
        paddingHorizontal: 8
    }
});