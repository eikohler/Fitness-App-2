import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, LayoutRectangle } from 'react-native';
import {
    GestureHandlerRootView,
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    SharedValue,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 80;
const LIST_OFFSET = 100;

type Workout = { id: number; title: string };
const initialWorkouts: Workout[] = [
    { id: 1, title: 'Push Day' },
    { id: 2, title: 'Pull Day' },
    { id: 3, title: 'Leg Day' },
    { id: 4, title: 'Core Day' },
    { id: 5, title: 'Mobility' },
];

export default function EditWorkouts() {
    const [workouts, setWorkouts] = useState(initialWorkouts);
    const [duplicatedWorkouts, setDuplicatedWorkouts] = useState<Workout[]>([]);
    const otherWrapperLayout = useRef<LayoutRectangle | null>(null);

    const activeId = useSharedValue<number | null>(null);
    const translateY = useSharedValue(0);
    const grabOffsetY = useSharedValue(0);
    const originalIndex = useSharedValue(0);
    const order = useSharedValue<number[]>(workouts.map((w) => w.id));

    const moveAndReset = (removeId: number | null) => {
        const filteredOrder = order.value.filter(id => workouts.find(w => w.id === id));

        const newWorkouts = filteredOrder.map(id =>
            workouts.find(w => w.id === id)!
        );

        if (removeId != null) {
            const finalWorkouts = newWorkouts.filter(w => w.id !== removeId);
            setWorkouts(finalWorkouts);
            order.value = finalWorkouts.map(w => w.id); // Keep `order` in sync
        } else {
            setWorkouts(newWorkouts);
            order.value = newWorkouts.map(w => w.id); // Ensure consistency
        }

        requestAnimationFrame(() => {
            activeId.value = null;
        });
    };


    const handleDrop = (x: number, y: number, item: Workout) => {
        const layout = otherWrapperLayout.current;
        if (
            layout &&
            y >= layout.y &&
            y <= layout.y + layout.height &&
            x >= layout.x &&
            x <= layout.x + layout.width
        ) {
            setDuplicatedWorkouts((prev) =>
                prev.find((w) => w.id === item.id) ? prev : [...prev, item]
            );

            return true;
        }

        return false;
    };

    const WorkoutItem = ({
        item,
        index,
        activeId,
        translateY,
        order,
        grabOffsetY,
        originalIndex,
        onDrop,
    }: {
        item: Workout;
        index: number;
        activeId: SharedValue<number | null>;
        translateY: SharedValue<number>;
        order: SharedValue<number[]>;
        grabOffsetY: SharedValue<number>;
        originalIndex: SharedValue<number>;
        onDrop: (x: number, y: number, item: Workout) => void;
    }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const isActive = activeId.value === item.id;
            const currentIndex = order.value.indexOf(item.id);
            const targetY = currentIndex * ITEM_HEIGHT + LIST_OFFSET;

            return {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                zIndex: isActive ? 100 : 0,
                transform: [
                    {
                        translateY: isActive
                            ? translateY.value
                            : withTiming(targetY),
                    },
                ],
            };
        });

        const gesture = Gesture.Pan()
            .onStart((e) => {
                activeId.value = item.id;
                grabOffsetY.value = e.y;
                translateY.value = index * ITEM_HEIGHT + LIST_OFFSET;
                originalIndex.value = index;
            })
            .onUpdate((e) => {
                const currentY = e.absoluteY - grabOffsetY.value;
                translateY.value = currentY;

                const dragIndex = order.value.indexOf(item.id);
                const newIndex = Math.max(
                    0,
                    Math.min(
                        Math.floor((currentY - LIST_OFFSET + ITEM_HEIGHT / 2) / ITEM_HEIGHT),
                        workouts.length - 1
                    )
                );

                if (newIndex !== dragIndex) {
                    const newOrder = [...order.value];
                    newOrder.splice(dragIndex, 1);
                    newOrder.splice(newIndex, 0, item.id);
                    order.value = newOrder;
                }
            })
            .onEnd((e) => {
                runOnJS(onDrop)(e.absoluteX, e.absoluteY, item);
            });

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.item, animatedStyle]}>
                    <Text style={styles.text}>{item.title}</Text>
                </Animated.View>
            </GestureDetector>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={{ height: workouts.length * ITEM_HEIGHT + LIST_OFFSET }}>
                    {workouts.map((item, index) => (
                        <WorkoutItem
                            key={item.id}
                            item={item}
                            index={index}
                            activeId={activeId}
                            translateY={translateY}
                            order={order}
                            grabOffsetY={grabOffsetY}
                            originalIndex={originalIndex}
                            onDrop={(x, y, droppedItem) => {
                                const shouldRemove = handleDrop(x, y, droppedItem);
                                moveAndReset(shouldRemove ? droppedItem.id : null);
                            }}
                        />
                    ))}
                </View>

                <View
                    style={styles.wrapper}
                    onLayout={(e) => {
                        otherWrapperLayout.current = e.nativeEvent.layout;
                    }}
                >
                    {duplicatedWorkouts.map((item, index) => (
                        <View key={index} style={[styles.item, { position: 'relative' }]}>
                            <Text style={styles.text}>{item.title}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 30,
        paddingTop: 30,
        borderTopColor: "#fff",
        borderTopWidth: 2,
        minHeight: 150
    },
    item: {
        height: ITEM_HEIGHT - 10,
        marginBottom: 10,
        marginHorizontal: 20,
        backgroundColor: '#000074',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
