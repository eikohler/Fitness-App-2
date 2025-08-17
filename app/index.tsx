import { Text, LayoutRectangle, StyleSheet, ScrollView } from 'react-native';
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
    },
    {
        id: 3,
        title: "Calisthenics Day",
        exercises: [
            { id: 7, title: 'Leg Raises' },
            { id: 8, title: 'Pullups' },
            { id: 9, title: 'Pushups' }
        ]
    }
];

const EXERCISE_HEIGHT = 55;
const EXERCISE_SPACING = 10;

export default function EditWorkouts() {

    const [workouts, setWorkouts] = useState<Workouts>(initialWorkouts);

    const workoutLayouts = useSharedValue<LayoutRectangle[]>([]);

    const exerciseOrders = useSharedValue<number[][]>(workouts.map(w => w.exercises.map(ex => ex.id)));

    const [exerciseTitles, setExerciseTitles] = useState(Array.from(
        new Set(initialWorkouts.flatMap(workout => workout.exercises.map(ex => ex.title)))
    ));

    const draggedExercise = useSharedValue<{ workoutID: number, exerciseID: number, exerciseTitle: string } | null>(null);

    const translateY = useSharedValue(0);

    const getUniqueExerciseTitles = (workouts: Workouts): string[] => {
        return Array.from(
            new Set(workouts.flatMap(workout => workout.exercises.map(ex => ex.title)))
        );
    };

    const getHoverLayoutIndex = (y: number) => {
        for (let i = 0; i < workoutLayouts.value.length; i++) {
            const layout = workoutLayouts.value[i];
            if (!layout) continue;

            // if ((y + EXERCISE_HEIGHT / 2) >= layout.y && (y - EXERCISE_HEIGHT / 2) <= layout.y + layout.height) {
            // if (y >= layout.y && (y - EXERCISE_HEIGHT * 0.75) <= layout.y + layout.height) {
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

    const handleHover = (touchY: number, exerciseID: number) => {
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

    const handleDrop = (touchY: number) => {
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

            } else if(exINWorkout) destIndex = i;

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
        const targetY = exerciseIndex * EXERCISE_HEIGHT + (exerciseIndex * EXERCISE_SPACING) + destLayout.y;        

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

        const gesture = Gesture.Pan()
            .onStart(e => {
                // Set active dragged exercise value to this exercise
                draggedExercise.value = { workoutID: workout.id, exerciseID: exercise.id, exerciseTitle: exercise.title };

                translateY.value = e.absoluteY - EXERCISE_HEIGHT / 2;
            })
            .onUpdate(e => {
                const touchY = e.absoluteY;

                translateY.value = touchY - EXERCISE_HEIGHT / 2;

                runOnJS(handleHover)(touchY, exercise.id);
            })
            .onEnd(e => {
                runOnJS(handleDrop)(e.absoluteY);
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
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.exercise, animatedStyle]}>
                    <Text style={styles.exerciseText}>{exercise.title}</Text>
                </Animated.View>
            </GestureDetector>
        );
    };

    const DragExercise = () => {
        const viewAnimatedStyle = useAnimatedStyle(() => {
            const isActive = draggedExercise.value !== null;

            return {
                position: "absolute",
                top: 0,
                left: 15,
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

        const animatedStyle = useAnimatedStyle(() => {

            const exOrder = [...exerciseOrders.value[index]];
            const length = Math.max(1, exOrder.includes(0) ? exOrder.length - 1 : exOrder.length);
            const spacingHeight = EXERCISE_SPACING * (length - 1);
            const height = length * EXERCISE_HEIGHT + spacingHeight;

            return {
                // backgroundColor: "#ffffff2a",
                marginBottom: 40,
                height: withTiming(height),
                zIndex: draggedExercise.value?.workoutID === workout.id ? 100 : 0
            };
        });

        return (<>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            <Animated.View style={animatedStyle} onLayout={(e) => {
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
                {workout.exercises.map((ex) =>
                    <RenderExercise key={ex.id} workout={workout} exercise={ex} />
                )}
            </Animated.View>
        </>);
    };

    return (<>
        <DragExercise />
        <ScrollView>
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