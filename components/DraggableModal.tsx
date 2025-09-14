import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, runOnJS, withTiming, Easing, withDecay } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import NotesField from './NotesField';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MIN_VELOCITY = 100;

const TOP = SCREEN_HEIGHT * 0.25;
const MIDDLE = SCREEN_HEIGHT * 0.60;
const CLOSE = SCREEN_HEIGHT * 0.8;
const BOTTOM = SCREEN_HEIGHT;

export default function DraggableModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const translateY = useSharedValue(BOTTOM);
    const startY = useSharedValue(0);
    const [isFocusing, setIsFocusing] = useState(false);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(isFocusing ? TOP : MIDDLE, {
                stiffness: 250,
                damping: 22,
                mass: 0.9,
                overshootClamping: false
            });
        }
    }, [visible, isFocusing]);

    const updateIsFocusing = (state: boolean) => setIsFocusing(state);

    const backgroundAnimStyle = useAnimatedStyle(() => {
        const invertedPercentage = ((BOTTOM - translateY.value) / (BOTTOM - MIDDLE));

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
            const limit = isFocusing ? TOP - 20 : MIDDLE - 20;

            translateY.value =
                startY.value + e.translationY < limit
                    ? limit + (startY.value + e.translationY - limit) * 0.2 // resistance factor
                    : startY.value + e.translationY;
        })
        .onEnd((e) => {
            const points = [MIDDLE, CLOSE];
            if (isFocusing) points.push(TOP);

            const target = translateY.value;

            const nearestSnap = points.reduce((prev, curr) =>
                Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
            );

            if (nearestSnap === CLOSE) {
                const velocity = Math.abs(e.velocityY) > MIN_VELOCITY ? e.velocityY : 0;

                translateY.value = withSpring(BOTTOM, {
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
                translateY.value = withSpring(nearestSnap, {
                    stiffness: 250,
                    damping: 22,
                    mass: 0.9,
                    overshootClamping: false
                });
            }

            if (nearestSnap >= MIDDLE) runOnJS(setIsFocusing)(false);
        });

    const bgTapGesture = Gesture.Tap()
        .onEnd((_e, success) => {
            if (success) {
                translateY.value = withSpring(BOTTOM, {
                    velocity: 0,
                    damping: 15,
                    stiffness: 250,
                    overshootClamping: true,
                }, (isFinished) => {
                    if (isFinished) {
                        console.log("test");
                        runOnJS(onClose)();
                    }
                });
            }
        });

    const bgLongPressGesture = Gesture.LongPress()
        .onEnd((_e, success) => {
            if (success) {
                translateY.value = withSpring(BOTTOM, {
                    velocity: 0,
                    damping: 15,
                    stiffness: 250,
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
                    <NotesField updateIsFocusing={updateIsFocusing} isFocusing={isFocusing} />
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
    },
    dragHandle: {
        width: 80,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        marginBottom: 30,
        marginHorizontal: "auto",
    },
});