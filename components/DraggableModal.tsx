import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, runOnJS, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import NotesField from './NotesField';
import LargeNumberField from './LargeNumberField';
import TitleField from './TitleField';
import MediumButton from './MediumButton';
import { colors } from '@/styles/Styles';
import InvertedButton from './InvertedButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MIN_VELOCITY = 100;

const TOP = 50;
const MIDDLE = SCREEN_HEIGHT * 0.55;
const CLOSE = SCREEN_HEIGHT * 0.8;
const BOTTOM = SCREEN_HEIGHT;
const EXERCISES = [
    "Push-Up",
    "Pull-Up",
    "Squat",
    "Lunge",
    "Deadlift",
    "Bench Press",
    "Shoulder Press",
    "Bicep Curl",
    "Tricep Dip",
    "Plank",
    "Mountain Climber",
    "Burpee",
    "Crunch",
    "Leg Raise",
    "Russian Twist",
    "Hip Thrust",
    "Calf Raise",
    "Lat Pulldown",
    "Row",
    "Overhead Press"
];

export default function DraggableModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const translateY = useSharedValue(BOTTOM);
    const startY = useSharedValue(0);
    const [isFocusing, setIsFocusing] = useState(false);
    const [tapClose, setTapClose] = useState(false);
    const [titleIsFocused, setTitleIsFocused] = useState(false);
    const [titleValue, setTitleValue] = useState('');
    const animInProgress = useSharedValue(false);

    useEffect(() => {
        if (visible) {
            animInProgress.value = true;
            translateY.value = withSpring(isFocusing ? TOP : MIDDLE, {
                stiffness: 250,
                damping: 22,
                mass: 0.9,
                overshootClamping: false
            }, function (isFinished) {
                if (isFinished) {
                    animInProgress.value = false;
                }
            });
        }
    }, [visible, isFocusing]);

    useEffect(() => {
        if (tapClose) {
            translateY.value = withSpring(BOTTOM, {
                velocity: 0,
                damping: 15,
                stiffness: 250,
                overshootClamping: true,
            }, (isFinished) => {
                if (isFinished) {
                    runOnJS(onClose)();
                    runOnJS(setTapClose)(false);
                }
            });
        }
    }, [tapClose]);

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

            animInProgress.value = true;

            if (nearestSnap === CLOSE) {
                const velocity = Math.abs(e.velocityY) > MIN_VELOCITY ? Math.abs(e.velocityY) : 0;

                translateY.value = withSpring(BOTTOM, {
                    velocity: velocity,
                    damping: 15,
                    stiffness: 250,
                    overshootClamping: true,
                }, (isFinished) => {
                    if (isFinished) {
                        animInProgress.value = false;
                        runOnJS(onClose)();
                    }
                });
            } else {
                translateY.value = withSpring(nearestSnap, {
                    stiffness: 250,
                    damping: 22,
                    mass: 0.9,
                    overshootClamping: false
                }, function (isFinished) {
                    if (isFinished) {
                        animInProgress.value = false;
                    }
                });
            }

            if (nearestSnap >= MIDDLE) runOnJS(setIsFocusing)(false);
        });

    const handleTapClose = () => {
        setIsFocusing(false);
        setTapClose(true);
    }

    const bgTapGesture = Gesture.Tap()
        .onEnd((_e, success) => {
            if (animInProgress.value) return;
            if (success) {
                runOnJS(handleTapClose)();
            }
        });

    const bgLongPressGesture = Gesture.LongPress()
        .onEnd((_e, success) => {
            if (animInProgress.value) return;
            if (success) {
                runOnJS(handleTapClose)();
            }
        });

    // Long press overrides tap
    const bgPressGesture = Gesture.Exclusive(bgLongPressGesture, bgTapGesture);

    const filterExercises = (list: string[], value: string) => {
        const query = value.toLowerCase().trim();
        if (!query) return list;

        return list
            .filter(exercise => exercise.toLowerCase().includes(query))
            .sort((a, b) => {
                const aName = a.toLowerCase();
                const bName = b.toLowerCase();

                const aStarts = aName.startsWith(query);
                const bStarts = bName.startsWith(query);

                // Prioritize those that start with the query
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;

                // Otherwise, sort alphabetically
                return aName.localeCompare(bName);
            });
    }

    return (
        <GestureHandlerRootView style={[styles.wrapper, { pointerEvents: visible ? "auto" : "none" }]}>
            <GestureDetector gesture={bgPressGesture}>
                <Animated.View style={[styles.background, backgroundAnimStyle]} />
            </GestureDetector>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.modal, modalAnimStyle]}>
                    <View style={styles.dragHandle} />
                    <View style={{ marginBottom: 10 }}>
                        <TitleField
                            updateIsFocusing={updateIsFocusing}
                            isFocusing={isFocusing}
                            updateTitleIsFocused={(state: boolean) => setTitleIsFocused(state)}
                            updateTitleValue={(text: string) => setTitleValue(text)}
                        />
                    </View>
                    {titleIsFocused ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.exerciseList}>
                                {filterExercises(EXERCISES, titleValue)?.map((exercise: string, i) => (
                                    <InvertedButton key={i} text={exercise} />
                                ))}
                            </View>
                        </ScrollView>
                    ) : (<>
                        <NotesField updateIsFocusing={updateIsFocusing} isFocusing={isFocusing} />
                        <View style={styles.largeInputsWrapper}>
                            <LargeNumberField updateIsFocusing={updateIsFocusing} isFocusing={isFocusing} fieldName='SETS' />
                            <LargeNumberField updateIsFocusing={updateIsFocusing} isFocusing={isFocusing} fieldName='REPS' />
                        </View>
                        <View style={{ marginTop: 25, display: "flex", alignItems: "center" }}>
                            <MediumButton text="SAVE" />
                        </View>
                    </>)}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView >
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
        backgroundColor: colors.darkBlue,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    dragHandle: {
        width: 80,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        marginBottom: 20,
        marginHorizontal: "auto",
    },
    largeInputsWrapper: {
        display: "flex",
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    exerciseList: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 12,
        columnGap: 8,
        paddingBottom: SCREEN_HEIGHT * 0.5
    }
});