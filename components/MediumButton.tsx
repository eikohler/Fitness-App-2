import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '@/styles/Styles';
import { StyleSheet, Text } from 'react-native';

export default function MediumButton({
    text,
    action,
    disabled
}: {
    text: string,
    action: () => void,
    disabled: boolean
}) {
    const isPressed = useSharedValue(false);
    const fast = 50;
    const slow = 150;

    const tapGesture = Gesture.Tap()
        .onBegin(() => {
            isPressed.value = true;
        })
        .onFinalize(() => {
            isPressed.value = false;
        })
        .onEnd((_e, success) => {
            if (success) {
                runOnJS(action)();
            }
        });

    const longPressGesture = Gesture.LongPress()
        .onBegin(() => {
            isPressed.value = true;
        })
        .onFinalize(() => {
            isPressed.value = false;
        })
        .onEnd((_e, success) => {
            if (success) {
                runOnJS(action)();
            }
        });

    // Long press overrides tap
    const pressGesture = Gesture.Exclusive(longPressGesture, tapGesture);

    const viewAnimStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: isPressed.value
                ? withTiming(colors.white, { duration: fast })
                : withTiming(colors.softWhite, { duration: slow }),
            padding: 10,
            borderRadius: 10,
            minWidth: 150,
            pointerEvents: disabled ? "none" : "auto",
            opacity: disabled ? withTiming(0.5) : withTiming(1)
        };
    });

    return (
        <GestureDetector gesture={pressGesture}>
            <Animated.View style={viewAnimStyle}>
                <Text style={styles.text}>{text}</Text>
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    text: {
        color: colors.darkBlue,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "700"
    }
});