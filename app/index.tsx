import { Text, LayoutRectangle, StyleSheet, View, Dimensions } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    ReduceMotion,
    runOnJS,
    runOnUI,
    scrollTo,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { FontAwesome6 } from "@expo/vector-icons";
import { colors } from '@/styles/Styles';
import DraggableModal from '@/components/DraggableModal';
import { AddedExercise } from '@/Interfaces/dataTypes';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


interface Exercise {
    id: string;
    title: string;
};

interface Workout {
    id: string;
    title: string;
    exercises: Exercise[]
}

type Workouts = Workout[];

const initialWorkouts: Workouts = [
    {
        id: uuidv4(),
        title: "Upper Body",
        exercises: [
            { id: uuidv4(), title: 'Bench Press 3x10' },
            { id: uuidv4(), title: 'Shoulder Press 3x10' },
            { id: uuidv4(), title: 'DB Curls 3x10' }
        ]
    },
    {
        id: uuidv4(),
        title: "Leg Day",
        exercises: [
            { id: uuidv4(), title: 'Leg Press 3x10' },
            { id: uuidv4(), title: 'Deadlifts 3x10' },
            { id: uuidv4(), title: 'Leg Curls 3x10' }
        ]
    },
    {
        id: uuidv4(),
        title: "Calisthenics Day",
        exercises: [
            { id: uuidv4(), title: 'Leg Raises 3x10' },
            { id: uuidv4(), title: 'Pullups 3x10' },
            { id: uuidv4(), title: 'Pushups 3x10' }
        ]
    },
    {
        id: uuidv4(),
        title: "Back Day",
        exercises: [
            { id: uuidv4(), title: 'Lat Pulldowns 3x10' },
            { id: uuidv4(), title: 'Cable Rows 3x10' },
            { id: uuidv4(), title: 'Bent over rows 3x10' }
        ]
    }
];

const EXERCISE_HEIGHT = 45;
const EXERCISE_SPACING = 10;

const SCREEN_TOP_PADDING = 70;
const SCREEN_SIDE_PADDING = 15;

const WORKOUT_BAR_LEFT_OFFSET = 42;
const WORKOUT_TITLE_HEIGHT = 32;
const WORKOUT_MARGIN_BOTTOM = 40;
const WORKOUT_DRAG_HEIGHT = EXERCISE_HEIGHT;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SCROLL_EDGE_THRESHOLD = 100;
const SCROLL_SPEED = 2;
const MAX_SCROLL_SPEED = 20;

const TIMING_DURATION = 350;

const DRAG_OPACITY = 0.6;

const PRESS_HOLD_LENGTH = 200;

const CLONE_EX_ID = "clone";

export default function EditWorkouts() {

    const [postUpdate, setPostUpdate] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalWorkoutID, setModalWorkoutID] = useState<string | null>(null);

    const [workouts, setWorkouts] = useState<Workouts>(initialWorkouts);

    const workoutLayouts = useSharedValue<LayoutRectangle[]>([]);

    const workoutsOrder = useSharedValue<string[]>(workouts.map(w => w.id));

    const exerciseOrders = useSharedValue<string[][]>(workouts.map(w => w.exercises.map(ex => ex.id)));

    const draggedWorkout = useSharedValue<{ workoutID: string, workoutTitle: string } | null>(null);

    const draggedExercise = useSharedValue<{ workoutID: string, exerciseID: string, exerciseTitle: string } | null>(null);

    const dragExerciseOpacity = useSharedValue(0);

    const dragWorkoutOpacity = useSharedValue(0);

    const dragExerciseStartDone = useSharedValue(false);

    const dragWorkoutStartDone = useSharedValue(false);

    const dragExerciseDropStart = useSharedValue(false);

    const dragWorkoutDropStart = useSharedValue(false);

    const translateY = useSharedValue(0);

    const scrollY = useSharedValue(0);

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const isAutoScrolling = useSharedValue(0);

    const absY = useSharedValue(0);

    const scrollNative = useMemo(() => Gesture.Native(), []);

    const AnimatedFontAwesome6 = Animated.createAnimatedComponent(FontAwesome6 as React.ComponentType<any>);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPostUpdate(true);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        dragWorkoutDropStart.value = false;
    }, [workouts]);

    useDerivedValue(() => {
        if (isAutoScrolling.value === 0 || (draggedWorkout.value === null && draggedExercise.value === null)) return;

        const distance = isAutoScrolling.value === -1
            ? absY.value
            : SCREEN_HEIGHT - absY.value;

        const ratio = Math.min(
            1,
            Math.max(0, 1 - distance / SCROLL_EDGE_THRESHOLD)
        );

        const speed = Math.max(SCROLL_SPEED, ratio * MAX_SCROLL_SPEED);

        const nextY = scrollY.value + isAutoScrolling.value * speed;
        scrollTo(scrollRef, 0, nextY, false);
    });

    const getHoverLayoutIndex = (y: number) => {
        for (let i = 0; i < workoutLayouts.value.length; i++) {
            const layout = workoutLayouts.value[i];
            if (!layout) continue;

            const offset = EXERCISE_HEIGHT / 2

            if (y + offset >= layout.y && y - offset <= layout.y + layout.height) {
                return i;
            }
        }
        return null;
    };

    const getExerciseOrderByTouchPosition = (
        exerciseID: string,
        touchY: number,
        layout: LayoutRectangle,
        exOrders: string[]
    ) => {
        const exerciseIndex = exOrders.findIndex(id => id === exerciseID);
        const length = exOrders.length;
        const newIndex = Math.max(0, Math.min(
            Math.floor((touchY - layout.y) / (EXERCISE_HEIGHT + ((EXERCISE_SPACING * (length - 1)) / length))),
            length - 1
        ));

        if (newIndex !== exerciseIndex) {
            exOrders.splice(exerciseIndex, 1);
            exOrders.splice(newIndex, 0, exerciseID);
        }

        return exOrders;
    }

    const handleHover = (touchY: number, exerciseID: string) => {
        const hoverIndex = getHoverLayoutIndex(touchY);

        const newExOrders = [...exerciseOrders.value];

        // IF not hovering any workout swap Exercise ID from workout with 0
        // Return
        if (hoverIndex === null) {
            for (let index = 0; index < newExOrders.length; index++) {
                if (newExOrders[index].includes(exerciseID)) {
                    newExOrders[index] = newExOrders[index].map(id => id === exerciseID ? CLONE_EX_ID : id);
                    break;
                }
            }
            exerciseOrders.value = newExOrders;

            if (dragExerciseDropStart.value) {
                handleDrop();
            }

            return;
        }

        // ELSE hovering workout

        // IF that workout has the original placement, swap with Exercise ID
        if (newExOrders[hoverIndex].includes(CLONE_EX_ID)) {
            newExOrders[hoverIndex] = newExOrders[hoverIndex].map(id => id === CLONE_EX_ID ? exerciseID : id);

            // ELSE remove 0 from last list
        } else {
            for (let index = 0; index < newExOrders.length; index++) {
                if (newExOrders[index].includes(CLONE_EX_ID)) {
                    newExOrders[index] = newExOrders[index].filter(id => id !== CLONE_EX_ID);
                    break;
                }
                if (index !== hoverIndex && newExOrders[index].includes(exerciseID)) {
                    newExOrders[index] = newExOrders[index].filter(id => id !== exerciseID);
                    break;
                }
            }
        }

        // IF Exercise ID does not exist in the hovered workout, Add the Exercise ID
        if (!newExOrders[hoverIndex].includes(exerciseID)) newExOrders[hoverIndex].push(exerciseID);

        // Now update the exercise ID in this hovered list
        newExOrders[hoverIndex] = getExerciseOrderByTouchPosition(
            exerciseID,
            touchY,
            workoutLayouts.value[hoverIndex],
            newExOrders[hoverIndex]
        );

        requestAnimationFrame(() => {
            exerciseOrders.value = newExOrders;
        });

        if (dragExerciseDropStart.value) {
            handleDrop();
        }
    };

    const handleHoverWorkout = (workoutID: string) => {
        const touchY = absY.value + scrollY.value;

        const order = [...workoutsOrder.value];

        const workoutIndex = order.findIndex(id => id === workoutID);

        const length = order.length;

        const newIndex = Math.max(0, Math.min(
            Math.floor((touchY - SCREEN_TOP_PADDING) / (WORKOUT_TITLE_HEIGHT + WORKOUT_DRAG_HEIGHT + WORKOUT_MARGIN_BOTTOM)),
            length - 1
        ));

        if (newIndex !== workoutIndex) {
            order.splice(workoutIndex, 1);
            order.splice(newIndex, 0, workoutID);
        }

        workoutsOrder.value = [...order];
    }

    const updateWorkouts = (newWorkouts: Workouts) => {
        setWorkouts([...newWorkouts]);

        requestAnimationFrame(() => {
            dragExerciseDropStart.value = false;
            draggedExercise.value = null;
        });
    }

    const handleDrop = () => {
        const dragValue = draggedExercise.value;

        if (!dragValue) return;

        const exOrders = [...exerciseOrders.value];

        let destIndex = 0;

        const newWorkouts = workouts.map((workout, i) => {
            const newWorkout = { ...workout };
            newWorkout.exercises = [...workout.exercises];

            if (exOrders[i].includes(CLONE_EX_ID)) {
                exOrders[i] = exOrders[i].map(id => id === CLONE_EX_ID ? dragValue.exerciseID : id);
            }

            // Boolean: Exercise is in the order list
            const exINOrderList = exOrders[i].includes(dragValue.exerciseID);

            // Boolean: Exercise is in the workout
            const exINWorkout = newWorkout.exercises.findIndex(ex => ex.id === dragValue.exerciseID) !== -1;

            // IF exercise is in the workout but NOT in the order list then REMOVE from the workout
            if (exINWorkout && !exINOrderList) {
                newWorkout.exercises = newWorkout.exercises.filter(ex => ex.id !== dragValue.exerciseID);

                // ELSE IF exercise is NOT in the workout but in the order list then ADD to the workout
            } else if (!exINWorkout && exINOrderList) {
                newWorkout.exercises.push({ id: dragValue.exerciseID, title: dragValue.exerciseTitle });
                destIndex = i;

            } else if (exINWorkout) destIndex = i;

            // Sort the Exercises in the workout by the Exercise Order list
            newWorkout.exercises = newWorkout.exercises.slice().sort(
                (a, b) => exOrders[i].indexOf(a.id) - exOrders[i].indexOf(b.id)
            );

            return newWorkout;
        });

        requestAnimationFrame(() => {
            exerciseOrders.value = exOrders;
        });

        const destY = exOrders
            .slice(0, destIndex)
            .reduce((sum, order) => {
                const length = Math.max(1, order.length + 1);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                const height = length * EXERCISE_HEIGHT + spacingHeight + WORKOUT_TITLE_HEIGHT;
                return sum + height + WORKOUT_MARGIN_BOTTOM;
            }, SCREEN_TOP_PADDING);

        const finalDestY = destY + WORKOUT_TITLE_HEIGHT;

        const exerciseIndex = exOrders[destIndex].findIndex(id => id === dragValue.exerciseID);
        const targetY = exerciseIndex * EXERCISE_HEIGHT + (exerciseIndex * EXERCISE_SPACING) + finalDestY - scrollY.value;

        dragExerciseOpacity.value = withTiming(1, { duration: TIMING_DURATION });

        translateY.value = withTiming(targetY, { duration: TIMING_DURATION }, (isFinished) => {
            if (isFinished) {
                runOnJS(updateWorkouts)(newWorkouts);
            }
        });
    }

    const handleDropWorkout = (newWorkouts: Workouts) => {
        setTimeout(() => {
            setWorkouts([...newWorkouts]);
        }, TIMING_DURATION);
    };

    useAnimatedReaction(
        () => {
            // only produce a value when we have a dragged exercise and auto-scroll or dragging is happening
            if (draggedExercise.value === null) return null;
            // returning this object causes the reaction to re-fire whenever absY or scrollY change
            return {
                touchY: absY.value + scrollY.value,
                exID: draggedExercise.value.exerciseID,
                auto: isAutoScrolling.value, // included so reaction fires when isAutoScrolling flips/animates
                dropStart: dragExerciseDropStart.value
            };
        },
        (data) => {
            if (data !== null) {
                // call your JS handler with the current touch position and exercise id
                runOnJS(handleHover)(data.touchY, data.exID);
            }
        }
    );

    const RenderExercise = ({ workout, exercise, scrollNative }: {
        workout: Workout;
        exercise: Exercise;
        scrollNative: ReturnType<typeof Gesture.Native>
    }) => {

        const wasActive = useSharedValue(false);
        const thisOpacity = useSharedValue(1);
        const posY = useSharedValue(0);

        const dragGesture = Gesture.Pan()
            .activateAfterLongPress(PRESS_HOLD_LENGTH)
            .minDistance(0)
            .onStart(e => {
                dragExerciseStartDone.value = false;

                // Set active dragged exercise value to this exercise
                draggedExercise.value = { workoutID: workout.id, exerciseID: exercise.id, exerciseTitle: exercise.title };

                absY.value = e.absoluteY;

                dragExerciseOpacity.value = 1;
                dragExerciseOpacity.value = withTiming(DRAG_OPACITY, { duration: TIMING_DURATION });

                const newY = e.absoluteY - EXERCISE_HEIGHT / 2;
                translateY.value = posY.value - scrollY.value;
                translateY.value = withTiming(newY, { duration: TIMING_DURATION }, function (isFinished) {
                    if (isFinished) {
                        dragExerciseStartDone.value = true;
                        translateY.value = e.absoluteY - EXERCISE_HEIGHT / 2;
                    }
                });
            })
            .onUpdate(e => {
                if (dragExerciseStartDone.value) {
                    translateY.value = e.absoluteY - EXERCISE_HEIGHT / 2;
                }

                absY.value = e.absoluteY;

                if (e.absoluteY < SCROLL_EDGE_THRESHOLD) {
                    isAutoScrolling.value = -1; // up
                } else if (e.absoluteY > SCREEN_HEIGHT - SCROLL_EDGE_THRESHOLD) {
                    isAutoScrolling.value = 1; // down
                } else {
                    isAutoScrolling.value = 0;
                }
            })
            .onEnd(() => {
                isAutoScrolling.value = 0;
                dragExerciseDropStart.value = true;
                // runOnJS(handleDrop)();
            });

        scrollNative.requireExternalGestureToFail(dragGesture);

        const wrapperAnimStyle = useAnimatedStyle(() => {
            const isActive = draggedExercise.value?.exerciseID === exercise.id
                && draggedExercise.value.workoutID === workout.id;

            if (isActive) wasActive.value = true;

            const workoutIndex = workouts.findIndex(w => w.id === workout.id);

            const isDraggingWorkout = draggedWorkout.value !== null;
            const isDraggingExercise = draggedExercise.value !== null;

            let targetY;

            let thisIndex;

            if (dragWorkoutDropStart.value) {
                const tempExOrder = workouts[workoutIndex].exercises.map(ex => ex.id);
                const exerciseIndex = tempExOrder.findIndex(id => id === exercise.id);
                thisIndex = exerciseIndex;
                targetY = exerciseIndex * EXERCISE_HEIGHT + (exerciseIndex * EXERCISE_SPACING);
            } else {
                const exOrder = [...exerciseOrders.value[workoutIndex]];
                const exerciseIndex = exOrder.findIndex(id => id === exercise.id);
                thisIndex = exerciseIndex;
                targetY = exerciseIndex * EXERCISE_HEIGHT + (exerciseIndex * EXERCISE_SPACING);
            }

            if (workoutLayouts.value[workoutIndex]) {
                posY.value = targetY + workoutLayouts.value[workoutIndex].y;
            }

            if (isDraggingWorkout && thisIndex > 0) thisOpacity.value = withTiming(0, { duration: 200 });
            else if (thisOpacity.value === 0) {
                if (wasActive.value) {
                    wasActive.value = false;
                    thisOpacity.value = DRAG_OPACITY;
                    thisOpacity.value = withTiming(1, { duration: TIMING_DURATION });
                } else {
                    thisOpacity.value = withTiming(1, { duration: 300 });
                }
            }

            return {
                opacity: isActive ? 0 : thisOpacity.value,
                backgroundColor: colors.darkBlue,
                pointerEvents: draggedExercise.value !== null ? "none" : "auto",
                transform: [{
                    translateY: isDraggingExercise ? withTiming(targetY, { duration: TIMING_DURATION }) : targetY
                }]
            };
        });

        return (
            <Animated.View style={[styles.exercise, wrapperAnimStyle]}>
                <Text style={styles.exerciseText}>{exercise.title}</Text>
                <GestureDetector gesture={dragGesture}>
                    <View style={styles.dragIcon}>
                        <FontAwesome6 name="grip-vertical" size={14} color={colors.white} />
                    </View>
                </GestureDetector>
            </Animated.View>
        );
    };

    const RenderPlusButton = ({ workout, dragElem }: { workout: Workout, dragElem?: boolean }) => {
        const thisOpacity = useSharedValue(dragElem ? 0 : 1);
        const isPressed = useSharedValue(false);
        const fast = 50;
        const slow = 150;

        const [mounted, setMounted] = useState(postUpdate);

        useEffect(() => {
            if (!postUpdate) setMounted(true);
        }, []);

        const tapGesture = Gesture.Tap()
            .onBegin(() => {
                isPressed.value = true;
            })
            .onFinalize(() => {
                isPressed.value = false;
            })
            .onEnd((_e, success) => {
                if (success) {
                    runOnJS(setModalVisible)(true);
                    runOnJS(setModalWorkoutID)(workout.id);
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
                    runOnJS(setModalVisible)(true);
                    runOnJS(setModalWorkoutID)(workout.id);
                }
            });

        // Long press overrides tap
        const pressGesture = Gesture.Exclusive(longPressGesture, tapGesture);

        const animStyle = useAnimatedStyle(() => {
            const workoutIndex = workouts.findIndex((w) => w.id === workout.id);
            const isDraggingWorkout = draggedWorkout.value !== null;
            const isDraggingExercise = draggedExercise.value !== null;

            const exOrder = dragWorkoutDropStart.value
                ? workouts[workoutIndex].exercises.map((ex) => ex.id)
                : [...exerciseOrders.value[workoutIndex]];
            const index = exOrder.length;

            const targetY =
                index * EXERCISE_HEIGHT + index * EXERCISE_SPACING;

            if (isDraggingWorkout && index > 0) {
                thisOpacity.value = withTiming(0, { duration: 200 });
            } else if (thisOpacity.value === 0) {
                thisOpacity.value = withTiming(1, { duration: 300 });
            } else if (draggedExercise.value !== null && dragElem) {
                thisOpacity.value = 0;
            }

            return {
                backgroundColor: isPressed.value
                    ? withTiming(colors.white, { duration: fast })
                    : withTiming("transparent", { duration: slow }),
                opacity: thisOpacity.value,
                pointerEvents:
                    draggedExercise.value !== null || draggedWorkout.value !== null
                        ? "none"
                        : "auto",
                transform: [
                    {
                        translateY: isDraggingExercise ? withTiming(targetY, { duration: TIMING_DURATION }) : targetY
                    },
                ],
            };
        });

        const iconStyle = useAnimatedStyle(() => {
            return {
                color: isPressed.value
                    ? withTiming(colors.mainBG, { duration: fast })
                    : withTiming(colors.white, { duration: slow }),
            };
        });

        return (
            <GestureDetector gesture={pressGesture}>
                <Animated.View style={[styles.plusButton, animStyle]}>
                    {mounted && <AnimatedFontAwesome6 name="plus" size={20} style={iconStyle} />}
                </Animated.View>
            </GestureDetector>
        );
    };


    const RenderWorkout = ({ workout, index, scrollNative }: {
        workout: Workout, index: number, scrollNative: ReturnType<typeof Gesture.Native>
    }) => {

        const thisOpacity = useSharedValue(1);
        const targetY = useSharedValue(0);
        const dragHeightChange = useSharedValue(false);

        const dragGesture = Gesture.Pan()
            .activateAfterLongPress(PRESS_HOLD_LENGTH)
            .minDistance(0)
            .onStart(e => {
                dragWorkoutStartDone.value = false;
                dragWorkoutOpacity.value = 1;
                dragWorkoutOpacity.value = withTiming(DRAG_OPACITY, { duration: TIMING_DURATION });
                thisOpacity.value = 0;
                draggedWorkout.value = { workoutID: workout.id, workoutTitle: workout.title };
                absY.value = e.absoluteY;

                const newY = e.absoluteY - ((WORKOUT_TITLE_HEIGHT + WORKOUT_DRAG_HEIGHT) / 2);
                translateY.value = targetY.value - scrollY.value;
                translateY.value = withTiming(newY, { duration: TIMING_DURATION }, (isFinished) => {
                    if (isFinished) {
                        dragWorkoutStartDone.value = true;
                        translateY.value = e.absoluteY - ((WORKOUT_TITLE_HEIGHT + WORKOUT_DRAG_HEIGHT) / 2);
                    }
                });
            })
            .onUpdate(e => {
                if (dragWorkoutDropStart.value) return;

                absY.value = e.absoluteY;

                if (dragWorkoutStartDone.value) {
                    translateY.value = e.absoluteY - ((WORKOUT_TITLE_HEIGHT + WORKOUT_DRAG_HEIGHT) / 2);
                }

                if (e.absoluteY < SCROLL_EDGE_THRESHOLD) {
                    isAutoScrolling.value = -1; // up
                } else if (e.absoluteY > SCREEN_HEIGHT - SCROLL_EDGE_THRESHOLD) {
                    isAutoScrolling.value = 1; // down
                } else {
                    isAutoScrolling.value = 0;
                }
                runOnJS(handleHoverWorkout)(workout.id);
            })
            .onEnd(() => {
                const check = () => {
                    if (dragWorkoutStartDone.value && dragHeightChange.value) {
                        dragWorkoutDropStart.value = true;

                        const order = [...workoutsOrder.value];

                        const newIndex = order.findIndex(id => id === workout.id);

                        const posY = order
                            .slice(0, newIndex)
                            .reduce((sum) => {
                                return sum + WORKOUT_DRAG_HEIGHT + WORKOUT_TITLE_HEIGHT + WORKOUT_MARGIN_BOTTOM;
                            }, SCREEN_TOP_PADDING);

                        translateY.value = withTiming(
                            posY + scrollY.value,
                            { duration: TIMING_DURATION },
                            function (isFinished) {
                                if (isFinished) {
                                    requestAnimationFrame(() => {
                                        thisOpacity.value = DRAG_OPACITY;
                                        thisOpacity.value = withTiming(1, { duration: TIMING_DURATION });
                                        draggedWorkout.value = null;

                                        const order = workoutsOrder.value;

                                        const workoutMap = new Map(workouts.map(w => [w.id, w]));

                                        const exerciseMap = new Map(workouts.map((w, i) => [w.id, exerciseOrders.value[i]]));

                                        const newWorkouts = order.map(id => workoutMap.get(id)!);
                                        const newExerciseOrders = order.map(id => exerciseMap.get(id)!);

                                        requestAnimationFrame(() => {
                                            exerciseOrders.value = [...newExerciseOrders];
                                        });

                                        runOnJS(handleDropWorkout)(newWorkouts);
                                    });
                                }
                            }
                        );
                    } else {
                        requestAnimationFrame(check);
                    }
                };

                requestAnimationFrame(check);
            });

        scrollNative.requireExternalGestureToFail(dragGesture);

        const placementAnimStyle = useAnimatedStyle(() => {

            const isDragging = draggedWorkout.value !== null;

            let height = WORKOUT_DRAG_HEIGHT;

            if (!isDragging) {
                const exOrder = [...exerciseOrders.value[index]];
                const length = Math.max(1, exOrder.length + 1);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                height = length * EXERCISE_HEIGHT + spacingHeight;
            }

            return {
                marginTop: WORKOUT_TITLE_HEIGHT,
                marginBottom: WORKOUT_MARGIN_BOTTOM,
                height: isDragging
                    ? withTiming(height, {
                        duration: 600,
                        easing: Easing.out(Easing.sin),
                        reduceMotion: ReduceMotion.System
                    }, function (isFinished) {
                        if (isFinished) {
                            dragHeightChange.value = true;
                        }
                    })
                    : withTiming(height, { duration: TIMING_DURATION })
            };
        });

        const wrapperAnimStyle = useAnimatedStyle(() => {

            const isActive = draggedWorkout.value?.workoutID === workout.id;

            const isDraggingExercise = draggedExercise.value !== null;
            const isDraggingWorkout = draggedWorkout.value !== null;

            let height = WORKOUT_DRAG_HEIGHT;

            if (!isDraggingWorkout) {
                const workoutIndex = dragWorkoutDropStart.value
                    ? workoutsOrder.value.findIndex((id) => id === workout.id)
                    : index;

                const exOrder = [...exerciseOrders.value[workoutIndex]];
                const length = Math.max(1, exOrder.length + 1);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                height = length * EXERCISE_HEIGHT + spacingHeight;
            }

            const order = [...workoutsOrder.value];

            const newIndex = order.findIndex(id => id === workout.id);

            const posY = workoutLayouts.value
                .slice(0, newIndex)
                .reduce((sum, workout) => {
                    const height = isDraggingWorkout ? WORKOUT_DRAG_HEIGHT : workout.height;
                    return sum + height + WORKOUT_TITLE_HEIGHT + WORKOUT_MARGIN_BOTTOM;
                }, SCREEN_TOP_PADDING);

            targetY.value = posY;

            return {
                position: "absolute",
                top: 0,
                left: SCREEN_SIDE_PADDING,
                right: SCREEN_SIDE_PADDING,
                pointerEvents: (isDraggingWorkout || isDraggingExercise) ? "none" : "auto",
                opacity: thisOpacity.value,
                marginTop: WORKOUT_TITLE_HEIGHT,
                height: withTiming(height, { duration: TIMING_DURATION }),
                zIndex: draggedExercise.value?.workoutID === workout.id ? 100 : isActive ? 100 : 0,
                transform: [{
                    translateY: isActive
                        ? dragWorkoutStartDone.value
                            ? posY
                            : translateY.value
                        : isDraggingWorkout
                            ? withTiming(posY, { duration: TIMING_DURATION })
                            : posY
                }],
            };
        });

        const dragBarAnimStyle = useAnimatedStyle(() => {

            const isDragging = draggedWorkout.value !== null;

            let height = WORKOUT_DRAG_HEIGHT + WORKOUT_TITLE_HEIGHT;

            if (!isDragging) {
                const workoutIndex = dragWorkoutDropStart.value
                    ? workoutsOrder.value.findIndex((id) => id === workout.id)
                    : index;

                const exOrder = [...exerciseOrders.value[workoutIndex]];
                const length = Math.max(1, exOrder.length + 1);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                height = length * EXERCISE_HEIGHT + spacingHeight + WORKOUT_TITLE_HEIGHT;
            }

            return {
                zIndex: 100,
                backgroundColor: colors.white,
                borderRadius: 10,
                width: WORKOUT_BAR_LEFT_OFFSET - 10,
                position: "absolute",
                left: 0,
                height: withTiming(height, { duration: TIMING_DURATION }),
                top: WORKOUT_TITLE_HEIGHT * -1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            };
        });

        return (<>
            <Animated.View style={placementAnimStyle} onLayout={(e) => {
                const layout = e.nativeEvent.layout;

                runOnUI(() => {
                    const prev = workoutLayouts.value;

                    const updated = [...prev];

                    if (!prev[index] || prev[index].y !== layout.y || prev[index].height !== layout.height) {
                        updated[index] = layout;
                        workoutLayouts.value = updated;
                    }
                })();
            }} />
            <Animated.View style={wrapperAnimStyle}>
                <GestureDetector gesture={dragGesture}>
                    <Animated.View style={dragBarAnimStyle}>
                        <FontAwesome6 name="grip-vertical" size={16} color={colors.black} />
                    </Animated.View>
                </GestureDetector>
                <Animated.Text style={styles.workoutTitle}>{workout.title}</Animated.Text>
                <Animated.View style={styles.workoutsWrapper}>
                    {workout.exercises.map((ex) =>
                        <RenderExercise key={ex.id} workout={workout} exercise={ex} scrollNative={scrollNative} />
                    )}
                    <RenderPlusButton workout={workout} />
                </Animated.View>
            </Animated.View>
        </>);
    };

    const DragExercise = ({ workout, exercise }: {
        workout: Workout;
        exercise: Exercise;
    }) => {

        const animatedStyle = useAnimatedStyle(() => {

            const isDragging = draggedWorkout.value !== null;
            const isActive = draggedExercise.value?.exerciseID === exercise.id
                && draggedExercise.value.workoutID === workout.id;

            const workoutIndex = workouts.findIndex(w => w.id === workout.id);

            const exOrder = [...exerciseOrders.value[workoutIndex]];
            const exerciseIndex = exOrder.findIndex(id => id === exercise.id);
            const targetY = exerciseIndex * EXERCISE_HEIGHT + (exerciseIndex * EXERCISE_SPACING);

            return {
                opacity: isActive
                    ? dragExerciseOpacity.value
                    : isDragging
                        ? 1
                        : 0,
                backgroundColor: colors.darkBlue,
                transform: [{
                    translateY: isActive ? translateY.value - WORKOUT_TITLE_HEIGHT : withTiming(targetY, { duration: TIMING_DURATION })
                }]
            };
        });

        return (
            <Animated.View style={[styles.exercise, animatedStyle]}>
                <Text style={styles.exerciseText}>{exercise.title}</Text>
                <View style={styles.dragIcon}>
                    <FontAwesome6 name="grip-vertical" size={14} color={colors.white} />
                </View>
            </Animated.View>
        );
    };

    const DragWorkout = ({ workout, index }: { workout: Workout, index: number }) => {

        const wrapperAnimStyle = useAnimatedStyle(() => {

            const isExerciseActive = draggedExercise.value?.workoutID === workout.id;
            const isActive = draggedWorkout.value?.workoutID === workout.id;

            let height = WORKOUT_DRAG_HEIGHT;

            if (!isActive) {
                const exOrder = [...exerciseOrders.value[index]];
                const length = Math.max(1, exOrder.length + 1);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                height = length * EXERCISE_HEIGHT + spacingHeight;
            }

            return {
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                left: SCREEN_SIDE_PADDING,
                right: SCREEN_SIDE_PADDING,
                opacity: isActive ? dragWorkoutOpacity.value : isExerciseActive ? 1 : 0,
                marginTop: WORKOUT_TITLE_HEIGHT,
                height: withTiming(height, { duration: TIMING_DURATION }),
                zIndex: 100,
                transform: [{
                    translateY: isExerciseActive ? 0 : translateY.value
                }],
            };
        });

        const dragBarAnimStyle = useAnimatedStyle(() => {

            const isExerciseActive = draggedExercise.value?.workoutID === workout.id;
            const isActive = draggedWorkout.value?.workoutID === workout.id;

            let height = WORKOUT_DRAG_HEIGHT + WORKOUT_TITLE_HEIGHT;

            if (!isActive) {
                const exOrder = [...exerciseOrders.value[index]];
                const length = Math.max(1, exOrder.length + 1);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                height = length * EXERCISE_HEIGHT + spacingHeight + WORKOUT_TITLE_HEIGHT;
            }

            return {
                zIndex: 100,
                backgroundColor: colors.white,
                borderRadius: 10,
                width: WORKOUT_BAR_LEFT_OFFSET - 10,
                position: "absolute",
                left: 0,
                top: WORKOUT_TITLE_HEIGHT * -1,
                height: withTiming(height, { duration: TIMING_DURATION }),
                opacity: isExerciseActive ? 0 : 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            };
        });

        const workoutWrapperAnimStyle = useAnimatedStyle(() => {
            const isExerciseActive = draggedExercise.value?.workoutID === workout.id;

            return {
                overflow: isExerciseActive ? "visible" : "hidden",
                height: "100%"
            };
        });

        const titleAnimStyle = useAnimatedStyle(() => {
            const isExerciseActive = draggedExercise.value?.workoutID === workout.id;

            return {
                opacity: isExerciseActive ? 0 : 1
            };
        });

        return (<>
            <Animated.View style={wrapperAnimStyle}>
                <Animated.View style={dragBarAnimStyle}>
                    <FontAwesome6 name="grip-vertical" size={16} color={colors.black} />
                </Animated.View>
                <Animated.Text style={[styles.workoutTitle, titleAnimStyle]}>{workout.title}</Animated.Text>
                <Animated.View style={workoutWrapperAnimStyle}>
                    {workout.exercises.map((ex) =>
                        <DragExercise key={ex.id} workout={workout} exercise={ex} />
                    )}
                    <RenderPlusButton workout={workout} dragElem />
                </Animated.View>
            </Animated.View>
        </>);
    };

    const addExerciseToWorkout = (workoutID: string, data: AddedExercise) => {
        const workoutIndex = workouts.findIndex((w) => w.id === workoutID);
        if (workoutIndex === -1) return;

        const exOrder = exerciseOrders.value;

        const newExID = uuidv4();

        const newExOrderForWorkout = [...exOrder[workoutIndex], newExID];

        const newExOrders = [...exOrder];
        newExOrders[workoutIndex] = newExOrderForWorkout;

        const newWorkouts = [...workouts];
        newWorkouts[workoutIndex] = {
            ...newWorkouts[workoutIndex],
            exercises: [
                ...newWorkouts[workoutIndex].exercises,
                {
                    id: newExID,
                    title: `${data.title} ${data.sets}x${data.reps}`,
                },
            ],
        };

        requestAnimationFrame(() => {
            exerciseOrders.value = [...newExOrders];
        });

        setWorkouts([...newWorkouts]);

        setModalVisible(false);
        setModalWorkoutID(null);
    }

    return (<>
        {workouts.map((w, i) =>
            <DragWorkout key={i} workout={w} index={i} />
        )}
        <GestureHandlerRootView>
            <GestureDetector gesture={scrollNative}>
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={scrollRef}
                    scrollEventThrottle={16}
                    onScroll={e => {
                        scrollY.value = e.nativeEvent.contentOffset.y;
                    }}>
                    <View style={styles.wrapper}>
                        {workouts.map((w, i) =>
                            <RenderWorkout key={i} workout={w} index={i} scrollNative={scrollNative} />
                        )}
                    </View>
                </Animated.ScrollView>
            </GestureDetector>
        </GestureHandlerRootView>
        <DraggableModal
            modalWorkoutID={modalWorkoutID}
            visible={modalVisible}
            onClose={() => {
                setModalVisible(false)
                setModalWorkoutID(null);
            }}
            addExerciseToWorkout={addExerciseToWorkout}
        />
    </>);
}


const styles = StyleSheet.create({
    wrapper: {
        paddingTop: SCREEN_TOP_PADDING,
        paddingHorizontal: SCREEN_SIDE_PADDING,
        flex: 1
    },
    workoutTitle: {
        zIndex: 100,
        fontSize: 20,
        fontWeight: 700,
        color: colors.white,
        height: WORKOUT_TITLE_HEIGHT,
        position: "absolute",
        top: WORKOUT_TITLE_HEIGHT * -1,
        left: WORKOUT_BAR_LEFT_OFFSET
    },
    workoutsWrapper: {
        overflow: "hidden",
        height: "100%"
    },
    exercise: {
        height: EXERCISE_HEIGHT,
        paddingHorizontal: 16,
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        top: 0,
        left: WORKOUT_BAR_LEFT_OFFSET,
        right: 0,
        overflow: "hidden"
    },
    exerciseText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 500
    },
    dragIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: EXERCISE_HEIGHT,
        width: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    plusButton: {
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        height: EXERCISE_HEIGHT - 2,
        position: "absolute",
        left: WORKOUT_BAR_LEFT_OFFSET,
        right: 0,
        top: 0
    }
});