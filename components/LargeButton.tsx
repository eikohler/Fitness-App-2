import { Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';
import { Href, router } from 'expo-router';
import { goBack } from 'expo-router/build/global-state/routing';

export default function LargeButton(props: {text: string; url?: Href}){

    const {text, url} = props;

  return (
    <Pressable style={styles.wrapper} onPress={()=>url ? router.push(url) : ""}>
        <Text style={styles.text}>{text}</Text>
    </Pressable>
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