import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, runOnJS, withTiming, Easing, withDecay } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MIN_VELOCITY = 100;
const MIDDLE = SCREEN_HEIGHT * 0.5;
const CLOSE = SCREEN_HEIGHT * 0.25;
const POINTS = [MIDDLE, CLOSE];

export default function DraggableModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const startY = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(MIDDLE, {
                stiffness: 250,
                damping: 22,
                mass: 0.9,
                overshootClamping: false
            });
        }
    }, [visible]);

    const backgroundAnimStyle = useAnimatedStyle(() => {
        const invertedPercentage = ((SCREEN_HEIGHT - translateY.value) / (SCREEN_HEIGHT - MIDDLE));

        return {
            opacity: invertedPercentage
        }
    });

    const modalAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: visible ? 1 : withTiming(0)
    }));

    // Gesture
    const panGesture = Gesture.Pan()
        .onStart(() => {
            startY.value = translateY.value;
        })
        .onUpdate((e) => {
            translateY.value = Math.max(50, startY.value + e.translationY);
        })
        .onEnd((e) => {
            const target = SCREEN_HEIGHT - translateY.value;

            const nearestSnap = POINTS.reduce((prev, curr) =>
                Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
            );
            const finalSnap = SCREEN_HEIGHT - nearestSnap;

            if (nearestSnap === CLOSE) {
                const velocity = Math.abs(e.velocityY) > MIN_VELOCITY ? e.velocityY : 0;

                translateY.value = withSpring(SCREEN_HEIGHT, {
                    velocity: velocity,
                    damping: 15,
                    stiffness: 250,
                    overshootClamping: true,
                }, (isFinished) => {
                    if (isFinished) {
                        runOnJS(onClose)();
                    }
                });
            } else {
                translateY.value = withSpring(finalSnap, {
                    stiffness: 250,
                    damping: 22,
                    mass: 0.9,
                    overshootClamping: false
                });
            }
        });

    const bgTapGesture = Gesture.Tap()
        .onEnd((_e, success) => {
            if (success) {
                translateY.value = withSpring(SCREEN_HEIGHT, {
                    velocity: 0,
                    damping: 15,
                    stiffness: 150,
                    overshootClamping: true,
                }, (isFinished) => {
                    if (isFinished) {
                        runOnJS(onClose)();
                    }
                });
            }
        });

    const bgLongPressGesture = Gesture.LongPress()
        .onEnd((_e, success) => {
            if (success) {
                translateY.value = withSpring(SCREEN_HEIGHT, {
                    velocity: 0,
                    damping: 15,
                    stiffness: 150,
                    overshootClamping: true,
                }, (isFinished) => {
                    if (isFinished) {
                        runOnJS(onClose)();
                    }
                });
            }
        });

    // Long press overrides tap
    const bgPressGesture = Gesture.Exclusive(bgLongPressGesture, bgTapGesture);

    return (
        <GestureHandlerRootView style={[styles.wrapper, { pointerEvents: visible ? "auto" : "none" }]}>
            <GestureDetector gesture={bgPressGesture}>
                <Animated.View style={[styles.background, backgroundAnimStyle]} />
            </GestureDetector>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.modal, modalAnimStyle]}>
                    <View style={styles.dragHandle} />
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
    },
    background: {
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modal: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        backgroundColor: '#000074',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    dragHandle: {
        width: 80,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        marginBottom: 10,
    },
    modalText: { fontSize: 18, marginVertical: 20 },
    closeButton: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 8 },
    buttonText: { color: 'white', fontWeight: 'bold' },
});