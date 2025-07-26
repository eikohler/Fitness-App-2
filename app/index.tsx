import { Text, LayoutRectangle, StyleSheet } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

interface Exercise {
    id: number;
    title: string;
};

interface Workout {
    layout: LayoutRectangle | null;
    id: number;
    title: string;
    exercises: Exercise[]
}

type Workouts = Workout[];

const initialWorkouts: Workouts = [
    {
        layout: null,
        id: 1,
        title: "Upper Body",
        exercises: [
            { id: 1, title: 'Bench Press' },
            { id: 2, title: 'Shoulder Press' },
            { id: 3, title: 'DB Curls' }
        ]
    },
    {
        layout: null,
        id: 2,
        title: "Leg Day",
        exercises: [
            { id: 4, title: 'Leg Press' },
            { id: 5, title: 'Deadlifts' },
            { id: 6, title: 'Leg Curls' }
        ]
    }
];

export default function EditWorkouts() {

    const workouts = useSharedValue<Workouts>(initialWorkouts);

    const draggedExercise = useSharedValue<{ id: number, exercise: Exercise } | null>(null);

    const updateWorkout = (id: number, updatedWorkout: {}) => {
        const newWorkouts = [...workouts.value];

        const index = newWorkouts.findIndex(w => w.id === id);

        if (index === -1) {
            console.warn(`Workout with ID ${id} not found.`);
            return;
        }

        // Return a new array with the updated workout
        newWorkouts[index] = {
            ...newWorkouts[index],
            ...updatedWorkout
        };

        workouts.value = newWorkouts;
    };


    const RenderExercise = ({ exercise }: { exercise: Exercise }) => {

        const animatedStyle = useAnimatedStyle(() => {
            // const isActive = activeId.value === item.id && activeList.value === listType;
            // const currentIndex = order.value.indexOf(item.id);
            // const targetY = currentIndex * ITEM_HEIGHT + LIST_PADDING;

            return {
                // position: 'absolute',
                // top: 0,
                // left: LIST_PADDING,
                // right: LIST_PADDING,
                // height: ITEM_HEIGHT,
                // zIndex: isActive ? 100 : 0,
                // opacity: isActive ? 0.8 : 1,
                // backgroundColor: isActive ? '#2929c3ff' : '#000074',
                // transform: [
                //     {
                //         translateY: isActive ? translateY.value : withTiming(targetY),
                //     },
                // ],
            };
        });

        const gesture = Gesture.Pan()
            .onStart(e => {
                // if (!layout || !layout.value) return;

                // activeId.value = item.id;
                // activeList.value = listType;

                // const touchY = e.absoluteY;

                // translateY.value = touchY - (ITEM_HEIGHT / 2) - layout.value.y;
            })
            .onUpdate(e => {
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

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.exercise, animatedStyle]}>
                    <Text style={styles.exerciseText}>{exercise.title}</Text>
                </Animated.View>
            </GestureDetector>
        );
    };

    const RenderWorkout = ({ workout }: { workout: Workout }) => {

        const animatedStyle = useAnimatedStyle(() => {
            // const height = order.value.length * ITEM_HEIGHT + (LIST_PADDING * 2);

            // return {
            //     height: withTiming(height),
            //     minHeight: ITEM_HEIGHT + (LIST_PADDING * 2),
            //     borderColor: "#fff", borderRadius: 20, borderWidth: 2,
            //     zIndex: listType === activeList.value ? 100 : 0
            // };

            return {};
        });

        return (
            <Animated.View style={animatedStyle}
                onLayout={e => {
                    const thisLayout = e.nativeEvent.layout;
                    updateWorkout(workout.id, { layout: thisLayout });
                }}>
                {workout.exercises.map((ex, i) =>
                    <RenderExercise key={i} exercise={ex} />
                )}
            </Animated.View>
        );
    };

    return (
        <GestureHandlerRootView style={styles.wrapper}>
            {workouts.value.map((w, i) =>
                <RenderWorkout key={i} workout={w} />
            )}
        </GestureHandlerRootView>
    );
}


const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 50,
        paddingHorizontal: 15
    },
    exercise: {
        backgroundColor: "#000074",
        padding: 16,
        borderRadius: 5
    },
    exerciseText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 600
    }
});