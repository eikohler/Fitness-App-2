import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useRef } from 'react';
import { colors, fonts, headerHeight, wrapperPaddingHorizontal } from '@/styles/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import ArrowIcon from "@/assets/icons/arrow-icon.svg";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function Header({
    title,
    btnText,
    btnStyle = true,
    showWeek,
    btnAction,
    cancel,
    middleText,
    hasUpdate = true
}: {
    title?: string;
    btnText: string;
    btnStyle?: boolean;
    showWeek?: boolean;
    btnAction: () => void;
    cancel?: () => void;
    middleText?: string;
    hasUpdate?: boolean;
}) {
    const fixedTitle = title?.replace(" ", "  ");

    const headerRef = useRef<any>(null);

    const navigation = useNavigation();

    const isPressed = useSharedValue(false);

    const tapGesture = Gesture.Tap()
        .onBegin(() => {
            isPressed.value = true;
        })
        .onFinalize(() => {
            isPressed.value = false;
        })
        .onEnd((_e, success) => {
            if (success) {
                runOnJS(btnAction)();
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
                runOnJS(btnAction)();
            }
        });

    // Long press overrides tap
    const pressGesture = Gesture.Exclusive(longPressGesture, tapGesture);
    const fast = 50;
    const slow = 150;

    const btnAnimStyles = useAnimatedStyle(() => {
        return {
            pointerEvents: hasUpdate ? "auto" : "none",
            opacity: hasUpdate ? 1 : 0.3,
            backgroundColor: btnStyle
                ? isPressed.value
                    ? withTiming("#5B6ED2", { duration: fast })
                    : withTiming("#222C5E", { duration: slow })
                : "",
            borderRadius: btnStyle ? 8 : 0,
            paddingVertical: btnStyle ? 5 : 0,
            paddingHorizontal: btnStyle ? 12 : 0
        }
    });

    return (
        <View ref={headerRef} style={[styles.container, {
            boxShadow: "0px 0px 5px rgba(13, 13, 13, 1)",
            height: headerHeight
        }]}>
            <View>
                <LinearGradient colors={['#000048', 'rgba(13, 13, 13, 0.85)']}
                    style={[styles.gradient]} />
                <View style={styles.wrapper}>
                    <View style={styles.content}>
                        <View>
                            {showWeek && (
                                <View style={styles.weekWrapper}>
                                    <Text style={styles.weekText}>WEEK 3</Text>
                                    <MaterialIcons name="bolt" size={18} color={colors.brightPurple} />
                                </View>
                            )}
                            {fixedTitle && (
                                <Text style={styles.title}>{fixedTitle}</Text>
                            )}
                            {cancel && (
                                <Pressable style={styles.cancelWrapper} onPress={cancel}>
                                    <View style={styles.cancelArrow}>
                                        <ArrowIcon style={{ transform: [{ rotate: '180deg' }] }} width={16} height={16} fill={colors.white} />
                                    </View>
                                    <Text style={styles.defaultText}>Cancel</Text>
                                </Pressable>
                            )}
                        </View>
                        {middleText && (
                            <Text style={styles.defaultText}>{middleText}</Text>
                        )}
                        <GestureDetector gesture={pressGesture}>
                            <Animated.View style={[styles.button, btnAnimStyles]}>
                                <Text style={styles.defaultText}>{btnText}</Text>
                            </Animated.View>
                        </GestureDetector>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100%"
    },
    defaultText: {
        color: colors.white,
        fontWeight: 700,
        fontSize: 16
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%"
    },
    wrapper: {
        paddingHorizontal: wrapperPaddingHorizontal,
        paddingBottom: 10,
        display: "flex",
        flexDirection: 'row',
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: "100%"
    },
    content: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "100%",
        gap: 15
    },
    title: {
        color: colors.white,
        fontSize: 26,
        textTransform: "uppercase",
        fontWeight: "900",
        fontStyle: "italic",
        fontFamily: fonts.mainFont,
        marginBottom: -6,
        letterSpacing: -3
    },
    button: {
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12
    },
    weekWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    weekText: {
        color: colors.brightPurple,
        fontSize: 16
    },
    cancelWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        gap: 10
    },
    cancelArrow: {
        backgroundColor: colors.softBlue,
        borderRadius: 100,
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});