import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '@/styles/Styles';

export default function InvertedButton({ text, action }: { text: string, action: () => void }) {
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
                : withTiming("transparent", { duration: slow }),
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isPressed.value
                ? withTiming(colors.white, { duration: fast })
                : withTiming(colors.softWhite, { duration: slow })
        };
    });

    const textAnimStyle = useAnimatedStyle(() => {
        return {
            color: isPressed.value
                ? withTiming(colors.darkBlue, { duration: fast })
                : withTiming(colors.softWhite, { duration: slow }),
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            letterSpacing: 0.5
        };
    });

    return (
        <GestureDetector gesture={pressGesture}>
            <Animated.View style={viewAnimStyle}>
                <Animated.Text style={textAnimStyle}>{text}</Animated.Text>
            </Animated.View>
        </GestureDetector>
    )
}