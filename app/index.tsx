import { Text, LayoutRectangle, StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Animated, { runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

interface Exercise {
    id: number;
    title: string;
};

interface Workout {
    id: number;
    title: string;
    exercises: Exercise[]
}

type Workouts = Workout[];

const initialWorkouts: Workouts = [
    {
        id: 1,
        title: "Upper Body",
        exercises: [
            { id: 1, title: 'Bench Press 3x10' },
            { id: 2, title: 'Shoulder Press 3x10' },
            { id: 3, title: 'DB Curls 3x10' }
        ]
    },
    {
        id: 2,
        title: "Leg Day",
        exercises: [
            { id: 4, title: 'Leg Press 3x10' },
            { id: 5, title: 'Deadlifts 3x10' },
            { id: 6, title: 'Leg Curls 3x10' }
        ]
    },
    {
        id: 3,
        title: "Calisthenics Day",
        exercises: [
            { id: 7, title: 'Leg Raises 3x10' },
            { id: 8, title: 'Pullups 3x10' },
            { id: 9, title: 'Pushups 3x10' }
        ]
    },
    {
        id: 4,
        title: "Back Day",
        exercises: [
            { id: 10, title: 'Lat Pulldowns 3x10' },
            { id: 11, title: 'Cable Rows 3x10' },
            { id: 12, title: 'Bent over rows 3x10' }
        ]
    }
];

const WORKOUT_BAR_LEFT_OFFSET = 50;
const WORKOUT_TITLE_HEIGHT = 32;
const WORKOUT_DRAG_BOTTOM_OFFSET = 20;
const EXERCISE_HEIGHT = 55;
const EXERCISE_SPACING = 10;
const SCREEN_PADDING = 15;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SCROLL_EDGE_THRESHOLD = 100; // px from top/bottom where auto-scroll should trigger
const MAX_SCROLL_SPEED = 20;           // px per frame (tweak for smoothness)

export default function EditWorkouts() {

    const [workouts, setWorkouts] = useState<Workouts>(initialWorkouts);

    const workoutLayouts = useSharedValue<LayoutRectangle[]>([]);

    const exerciseOrders = useSharedValue<number[][]>(workouts.map(w => w.exercises.map(ex => ex.id)));

    const [exerciseTitles, setExerciseTitles] = useState(Array.from(
        new Set(initialWorkouts.flatMap(workout => workout.exercises.map(ex => ex.title)))
    ));

    const draggedWorkout = useSharedValue<{ workoutID: number } | null>(null);

    const draggedExercise = useSharedValue<{ workoutID: number, exerciseID: number, exerciseTitle: string } | null>(null);

    const translateY = useSharedValue(0);

    const scrollY = useSharedValue(0);

    const scrollRef = React.useRef<ScrollView>(null);

    function getScrollSpeed(distance: number) {
        // distance = how far inside the "edge zone" the finger is
        // closer to edge → faster speed
        const ratio = 1 - distance / SCROLL_EDGE_THRESHOLD; // 0 → 1
        return Math.max(0, ratio * MAX_SCROLL_SPEED);
    }

    const getUniqueExerciseTitles = (workouts: Workouts): string[] => {
        return Array.from(
            new Set(workouts.flatMap(workout => workout.exercises.map(ex => ex.title)))
        );
    };

    const getHoverLayoutIndex = (y: number) => {
        for (let i = 0; i < workoutLayouts.value.length; i++) {
            const layout = workoutLayouts.value[i];
            if (!layout) continue;

            if (y >= layout.y && y - EXERCISE_HEIGHT * 0.4 <= layout.y + layout.height) {
                return i;
            }
        }
        return null;
    };

    const getExerciseOrderByTouchPosition = (
        exerciseID: number,
        touchY: number,
        layout: LayoutRectangle,
        exOrders: number[]
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

    const autoScroll = (absY: number) => {
        if (absY < SCROLL_EDGE_THRESHOLD) { // Near Top
            const speed = getScrollSpeed(absY);

            if (scrollRef.current) {

                scrollRef.current.scrollTo({
                    y: Math.max(0, scrollY.value - speed),
                    animated: false,
                });
            }
        } else if (absY > SCREEN_HEIGHT - SCROLL_EDGE_THRESHOLD) { // Near Bottom
            const speed = getScrollSpeed(SCREEN_HEIGHT - absY);

            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    y: scrollY.value + speed,
                    animated: false,
                });
            }
        }
    }

    const handleHover = (touchY: number, absY: number, exerciseID: number) => {

        autoScroll(absY);

        const hoverIndex = getHoverLayoutIndex(touchY);

        const newExOrders = [...exerciseOrders.value];

        // IF not hovering any workout swap Exercise ID from workout with 0
        // Return
        if (hoverIndex === null) {
            for (let index = 0; index < newExOrders.length; index++) {
                if (newExOrders[index].includes(exerciseID)) {
                    newExOrders[index] = newExOrders[index].map(id => id === exerciseID ? 0 : id);
                    break;
                }
            }
            exerciseOrders.value = newExOrders;
            return;
        }

        // ELSE hovering workout

        // IF that workout has the original placement, swap with Exercise ID
        if (newExOrders[hoverIndex].includes(0)) {
            newExOrders[hoverIndex] = newExOrders[hoverIndex].map(id => id === 0 ? exerciseID : id);

            // ELSE remove 0 from last list
        } else {
            for (let index = 0; index < newExOrders.length; index++) {
                if (newExOrders[index].includes(0)) {
                    newExOrders[index] = newExOrders[index].filter(id => id !== 0);
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
    };

    const updateWorkouts = (newWorkouts: Workouts) => {
        setWorkouts([...newWorkouts]);
        setExerciseTitles([...getUniqueExerciseTitles(newWorkouts)]);

        requestAnimationFrame(() => {
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

            if (exOrders[i].includes(0)) {
                exOrders[i] = exOrders[i].map(id => id === 0 ? dragValue.exerciseID : id);
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

        const destLayout = workoutLayouts.value[destIndex];
        const exerciseIndex = exOrders[destIndex].findIndex(id => id === dragValue.exerciseID);
        const targetY = exerciseIndex * EXERCISE_HEIGHT + (exerciseIndex * EXERCISE_SPACING) + destLayout.y - scrollY.value;

        translateY.value = withTiming(targetY, {}, (isFinished) => {
            if (isFinished) {
                runOnJS(updateWorkouts)(newWorkouts);
            }
        });
    }

    const RenderExercise = ({ workout, exercise }: {
        workout: Workout;
        exercise: Exercise;
    }) => {

        const dragGesture = Gesture.Pan()
            .activateAfterLongPress(200)
            .onStart(e => {
                // Set active dragged exercise value to this exercise
                draggedExercise.value = { workoutID: workout.id, exerciseID: exercise.id, exerciseTitle: exercise.title };

                translateY.value = e.absoluteY - EXERCISE_HEIGHT / 2;
            })
            .onUpdate(e => {
                translateY.value = e.absoluteY - EXERCISE_HEIGHT / 2;

                const touchY = e.absoluteY + scrollY.value;

                runOnJS(handleHover)(touchY, e.absoluteY, exercise.id);
            })
            .onEnd(() => {
                runOnJS(handleDrop)();
            });

        const animatedStyle = useAnimatedStyle(() => {
            const isActive = draggedExercise.value?.exerciseID === exercise.id
                && draggedExercise.value.workoutID === workout.id;

            const workoutIndex = workouts.findIndex(w => w.id === workout.id);

            const exOrder = exerciseOrders.value[workoutIndex];

            const exerciseIndex = exOrder.findIndex(id => id === exercise.id);

            const newExIndex = exOrder.findIndex(id => id === 0) === 0 ? exerciseIndex - 1 : exerciseIndex;

            const targetY = newExIndex * EXERCISE_HEIGHT + (newExIndex * EXERCISE_SPACING);

            return {
                opacity: isActive ? 0 : 1,
                backgroundColor: '#000074',
                pointerEvents: draggedExercise.value !== null ? "none" : "auto",
                transform: [{
                    translateY: withTiming(targetY)
                }]
            };
        });

        return (
            <Animated.View style={[styles.exercise, animatedStyle]}>
                <Text style={styles.exerciseText}>{exercise.title}</Text>
                <GestureDetector gesture={dragGesture}>
                    <View style={styles.dragIcon}></View>
                </GestureDetector>
            </Animated.View>
        );
    };

    const DragExercise = () => {
        const viewAnimatedStyle = useAnimatedStyle(() => {
            const isActive = draggedExercise.value !== null;

            return {
                position: "absolute",
                top: 0,
                left: WORKOUT_BAR_LEFT_OFFSET + SCREEN_PADDING,
                right: 15,
                zIndex: 100,
                opacity: isActive ? 0.8 : 0,
                backgroundColor: '#2929c3ff',
                pointerEvents: isActive ? "auto" : "none",
                transform: [{
                    translateY: isActive ? translateY.value : 0
                }]
            };
        });

        return (
            <Animated.View style={[styles.exercise, viewAnimatedStyle]}>
                {exerciseTitles.map((title, i) => {
                    const textAnimatedStyle = useAnimatedStyle(() => {
                        const isActive = draggedExercise.value?.exerciseTitle === title;
                        return {
                            opacity: isActive ? 1 : 0,
                            position: isActive ? "relative" : "absolute"
                        };
                    });

                    return (
                        <Animated.Text key={i} style={[styles.exerciseText, textAnimatedStyle]}>
                            {title}
                        </Animated.Text>
                    );
                })}
            </Animated.View>
        );
    };

    const RenderWorkout = ({ workout, index }: { workout: Workout, index: number }) => {

        const dragGesture = Gesture.Pan()
            .activateAfterLongPress(200)
            .onStart(e => {
                console.log("Press Active");

                // Set active dragged workout value to this workout
                draggedWorkout.value = { workoutID: workout.id };

                // translateY.value = e.absoluteY - EXERCISE_HEIGHT / 2;
            })
            .onUpdate(e => {
                // translateY.value = e.absoluteY - EXERCISE_HEIGHT / 2;

                // const touchY = e.absoluteY + scrollY.value;

                // runOnJS(handleHover)(touchY, e.absoluteY, exercise.id);
            })
            .onEnd(() => {
                requestAnimationFrame(() => {
                    draggedWorkout.value = null;
                });
                // runOnJS(handleDrop)();
            });

        const wrapperAnimStyle = useAnimatedStyle(() => {

            const isActive = draggedWorkout.value?.workoutID === workout.id;

            let height = 0;
            if (!isActive) {
                const exOrder = [...exerciseOrders.value[index]];
                const length = Math.max(1, exOrder.includes(0) ? exOrder.length - 1 : exOrder.length);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                height = length * EXERCISE_HEIGHT + spacingHeight;
            }

            return {
                // backgroundColor: "#ffffff2a",
                marginTop: WORKOUT_TITLE_HEIGHT,
                marginBottom: isActive ? withTiming(WORKOUT_DRAG_BOTTOM_OFFSET + 40) : withTiming(40),
                height: withTiming(height),
                zIndex: draggedExercise.value?.workoutID === workout.id ? 100 : 0
            };
        });

        const dragBarAnimStyle = useAnimatedStyle(() => {

            const isActive = draggedWorkout.value?.workoutID === workout.id;

            let height = WORKOUT_TITLE_HEIGHT + WORKOUT_DRAG_BOTTOM_OFFSET;
            if (!isActive) {
                const exOrder = [...exerciseOrders.value[index]];
                const length = Math.max(1, exOrder.includes(0) ? exOrder.length - 1 : exOrder.length);
                const spacingHeight = EXERCISE_SPACING * (length - 1);
                height = length * EXERCISE_HEIGHT + spacingHeight + WORKOUT_TITLE_HEIGHT;
            }

            return {
                zIndex: 100,
                position: "absolute",
                left: 0,
                top: WORKOUT_TITLE_HEIGHT * -1,
                backgroundColor: "#fff",
                borderRadius: 10,
                width: WORKOUT_BAR_LEFT_OFFSET - 10,
                height: withTiming(height)
            };
        });

        return (<>
            <Animated.View style={wrapperAnimStyle} onLayout={(e) => {
                const layout = e.nativeEvent.layout;

                runOnUI(() => {
                    const prev = workoutLayouts.value;

                    const updated = [...prev];

                    if (!prev[index] || prev[index].y !== layout.y || prev[index].height !== layout.height) {
                        updated[index] = layout;
                        workoutLayouts.value = updated;
                    }
                })();
            }}>
                <GestureDetector gesture={dragGesture}>
                    <Animated.View style={dragBarAnimStyle}></Animated.View>
                </GestureDetector>
                <Text style={styles.workoutTitle}>{workout.title}</Text>
                <View style={{ overflow: "hidden", height: "100%" }}>
                    {workout.exercises.map((ex) =>
                        <RenderExercise key={ex.id} workout={workout} exercise={ex} />
                    )}
                </View>
            </Animated.View>
        </>);
    };

    return (<>
        <DragExercise />
        <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollRef}
            scrollEventThrottle={16}
            onScroll={e => {
                scrollY.value = e.nativeEvent.contentOffset.y;
            }}>
            <GestureHandlerRootView style={styles.wrapper}>
                {workouts.map((w, i) =>
                    <RenderWorkout key={i} workout={w} index={i} />
                )}
            </GestureHandlerRootView>
        </ScrollView>
    </>);
}


const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 70,
        paddingHorizontal: SCREEN_PADDING
    },
    workoutTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: "#fff",
        height: WORKOUT_TITLE_HEIGHT,
        position: "absolute",
        top: WORKOUT_TITLE_HEIGHT * -1,
        left: WORKOUT_BAR_LEFT_OFFSET
    },
    exercise: {
        height: EXERCISE_HEIGHT,
        padding: 16,
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
        color: "#fff",
        fontSize: 16,
        fontWeight: 600
    },
    dragIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: EXERCISE_HEIGHT,
        width: 50,
        backgroundColor: "#fff",
    }
});