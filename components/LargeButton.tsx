import { Text, StyleSheet, Pressable, View, useAnimatedValue, Animated, Easing } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';
import { Href, router } from 'expo-router';

export default function LargeButton(props: { text: string; url?: Href }) {

    const { text, url } = props;

    const x = useAnimatedValue(0);
    const y = useAnimatedValue(0);

    const pressInAnim = () => {
        Animated.parallel([
            Animated.timing(x, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(y, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();
    }

    const pressOutAnim = () => {
        Animated.parallel([
            Animated.timing(x, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(y, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();
    }

    return (<>
        <Pressable onPressOut={pressOutAnim} onPressIn={pressInAnim} 
        style={styles.wrapper} onPress={() => url ? router.push(url) : ""}>    
            <View style={styles.shadow}>
                <Text style={[styles.text, {color: "#000000"}]}>{text}</Text>
            </View>
            <Animated.View style={[styles.overlay, {
                transform: [ { translateX: x }, { translateY: y } ]
            }]}>
                <Text style={styles.text}>{text}</Text>
            </Animated.View>
        </Pressable>
    </>)
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: "auto",
        position: "relative",
        // boxShadow: "-10 10 0 #000000"
    },
    shadow: {
        borderRadius: 32,
        backgroundColor: "#000000",
        paddingHorizontal: 50,
        paddingVertical: 30
    },
    overlay: {
        borderRadius: 32,
        backgroundColor: colors.largeButtonBG,
        paddingHorizontal: 50,
        paddingVertical: 30,        
        position: "absolute",
        left: 10,
        bottom: 10
    },
    text: {
        color: colors.primaryText,
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: 20,
        letterSpacing: 1,
        fontFamily: fonts.mainFont,        
    }
});