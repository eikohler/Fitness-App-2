import { Text, StyleSheet, Pressable, View } from 'react-native';
import React from 'react';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/styles/Styles';

export default function LargeButton({
    text,
    action,
}: {
    text: string;
    action?: () => void;
}) {
    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const bgColor = useSharedValue(colors.darkBlue);
    const isPressed = useSharedValue(false);

    const pressInAnim = () => {
        bgColor.value = withTiming('#0000d4ff', { duration: 100 });
        x.value = withTiming(-8, { duration: 100 });
        y.value = withTiming(8, { duration: 100 });
    };

    const pressOutAnim = () => {
        bgColor.value = withTiming(colors.darkBlue, { duration: 200 });
        x.value = withTiming(0, { duration: 200 });
        y.value = withTiming(0, { duration: 200 }, (finished) => {
            if (finished && action && isPressed.value) {
                isPressed.value = false;
                runOnJS(action)();
            }
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: x.value }, { translateY: y.value }],
        backgroundColor: bgColor.value,
    }));

    return (
        <Pressable
            onPressIn={pressInAnim}
            onPressOut={pressOutAnim}
            onPress={() => { isPressed.value = true }}
            style={styles.wrapper}
        >
            <View style={styles.shadow}>
                <Text style={[styles.text, { color: '#000000' }]}>{text}</Text>
            </View>

            <Animated.View style={[styles.overlay, animatedStyle]}>
                <Text style={styles.text}>{text}</Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 'auto',
        position: 'relative',
    },
    shadow: {
        borderRadius: 10,
        backgroundColor: '#000000',
        paddingHorizontal: 34,
        paddingVertical: 20,
    },
    overlay: {
        borderRadius: 10,
        paddingHorizontal: 34,
        paddingVertical: 20,
        position: 'absolute',
        left: 8,
        bottom: 8,
    },
    text: {
        color: colors.white,
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: 22,
        letterSpacing: 1,
    },
});
