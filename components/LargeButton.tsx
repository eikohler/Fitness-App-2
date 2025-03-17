import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';

export default function LargeButton(props: {text: string}){

    const {text} = props;

  return (
    <View style={styles.wrapper}>
        <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({    
    wrapper: {
        borderRadius: 32,
        backgroundColor: colors.largeButtonBG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 50,
        paddingVertical: 30,
        marginHorizontal: "auto",
        boxShadow: "-10 10 0 #000000"        
    },
    text: {
        color: colors.primaryText,
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: 20,
        letterSpacing: 1,
        fontFamily: fonts.mainFont
    }
});