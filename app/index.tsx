import { Text, LayoutRectangle, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
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

// type WorkoutLayouts = (LayoutRectangle | null)[];

type ExerciseOrders = number[][];

const initialWorkouts: Workouts = [
    {
        id: 1,
        title: "Upper Body",
        exercises: [
            { id: 1, title: 'Bench Press' },
            { id: 2, title: 'Shoulder Press' },
            { id: 3, title: 'DB Curls' }
        ]
    },
    {
        id: 2,
        title: "Leg Day",
        exercises: [
            { id: 4, title: 'Leg Press' },
            { id: 5, title: 'Deadlifts' },
            { id: 6, title: 'Leg Curls' }
        ]
    }
];

const EXERCISE_HEIGHT = 55;
const EXERCISE_SPACING = 10;

export default function EditWorkouts() {

    const [workouts, setWorkouts] = useState<Workouts>(initialWorkouts);

    const [workoutLayouts, setWorkoutLayouts] = useState<LayoutRectangle[]>([]);

    const exerciseOrders = useSharedValue<ExerciseOrders>(workouts.map(w => w.exercises.map(ex => ex.id)));

    const draggedExercise = useSharedValue<{ workoutID: number, exerciseID: number } | null>(null);

    const translateY = useSharedValue(0);

    const RenderExercise = ({ workout, exercise }: {
        workout: Workout;
        exercise: Exercise;
    }) => {

        const gesture = Gesture.Pan()
            .onStart(e => {
                console.log(e);

                console.log(workoutLayouts);

                const workoutIndex = workouts.findIndex(w => w.id === workout.id);

                // const layout = workoutLayouts.value[workoutIndex];

                const layout = workoutLayouts[workoutIndex];

                if (!layout) {
                    console.error(`Can't load layout for workout with ID ${workout?.id}`);
                    return;
                }

                // Set active dragged exercise value to this exercise
                draggedExercise.value = { workoutID: workout.id, exerciseID: exercise.id };

                const touchY = e.absoluteY;

                translateY.value = touchY - (EXERCISE_HEIGHT / 2) - layout.y;
            })
            .onUpdate(e => {
                const workoutIndex = workouts.findIndex(w => w.id === workout.id);

                // const layout = workoutLayouts.value[workoutIndex];

                const layout = workoutLayouts[workoutIndex];

                if (!layout) return;

                const touchY = e.absoluteY;

                translateY.value = touchY - (EXERCISE_HEIGHT / 2) - layout.y;
                // if (!layout || !layout.value) return;

                // const currentY = e.absoluteY;

                // translateY.value = currentY - (ITEM_HEIGHT / 2) - layout.value.y;

                // // console.log("Current Y: ", currentY, "Translate Y: ", translateY.value);

                // const currentIndex = order.value.indexOf(item.id);
                // const newIndex = Math.max(0, Math.min(
                //     Math.floor((currentY - layout.value.y - LIST_PADDING) / ITEM_HEIGHT),
                //     order.value.length - 1
                // ));

                // if (newIndex !== currentIndex) {
                //     const newOrder = [...order.value];
                //     newOrder.splice(currentIndex, 1);
                //     newOrder.splice(newIndex, 0, item.id);
                //     order.value = newOrder;
                // }

                // runOnJS(handleHover)(e.absoluteY, item);
            })
            .onEnd(e => {
                // runOnJS(handleDrop)(e.absoluteY, item);
            });

        const animatedStyle = useAnimatedStyle(() => {
            const isActive = draggedExercise.value?.workoutID === workout.id
                && draggedExercise.value?.exerciseID === exercise.id;

            const workoutIndex = workouts.findIndex(w => w.id === workout.id);
            const exerciseIndex = exerciseOrders.value[workoutIndex].findIndex(id => id === exercise.id);

            const targetY = exerciseIndex * EXERCISE_HEIGHT + (exerciseIndex * EXERCISE_SPACING);

            return {
                zIndex: isActive ? 100 : 1,
                opacity: isActive ? 0.8 : 1,
                backgroundColor: isActive ? '#2929c3ff' : '#000074',
                transform: [
                    {
                        translateY: isActive ? translateY.value : withTiming(targetY)
                    },
                ]
            };
        });

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.exercise, animatedStyle]}>
                    <Text style={styles.exerciseText}>{exercise.title}</Text>
                </Animated.View>
            </GestureDetector>
        );
    };

    const RenderWorkout = ({ workout, index }: { workout: Workout, index: number }) => {

        const animatedStyle = useAnimatedStyle(() => {
            const length = workout.exercises.length;
            const spacingHeight = (EXERCISE_SPACING * ((length - 1) * length) / 2) - EXERCISE_SPACING;
            const height = length * EXERCISE_HEIGHT + spacingHeight;

            return {
                backgroundColor: "#ffffff2a",
                marginBottom: 40,
                height: withTiming(height),
                zIndex: draggedExercise.value?.workoutID === workout.id ? 100 : 0
            };
        });

        return (<>
            <Text style={styles.workoutTitle}>{workout.title}</Text>            
            <Animated.View style={animatedStyle} onLayout={(e) => {
                const layout = e.nativeEvent.layout;
                setWorkoutLayouts(prev => {
                    // Return if layout y position hasn't changed
                    if (prev[index] && prev[index].y === layout.y) return prev;

                    const copy = [...prev];
                    copy[index] = layout;
                    return copy;
                });
            }}>
                {workout.exercises.map((ex) =>
                    <RenderExercise key={ex.id} workout={workout} exercise={ex} />
                )}
            </Animated.View>
        </>);
    };

    return (
        <GestureHandlerRootView style={styles.wrapper}>
            {workouts.map((w, i) =>
                <RenderWorkout key={i} workout={w} index={i} />
            )}
        </GestureHandlerRootView>
    );
}


const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 70,
        paddingHorizontal: 15
    },
    workoutTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: "#fff",
        marginBottom: 10
    },
    exercise: {
        height: EXERCISE_HEIGHT,
        padding: 16,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0
    },
    exerciseText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 600
    }
});