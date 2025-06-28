import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
} from 'react-native-reanimated';

const ITEM_HEIGHT = 80;

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

    const activeId = useSharedValue<number | null>(null);
    const translateY = useSharedValue(0);
    const grabOffsetY = useSharedValue(0);
    const originalIndex = useSharedValue(0);

    // Track which items are displaced, and in which direction
    const displacedMap = useSharedValue<Record<number, 'up' | 'down' | null>>({});

    const move = (from: number, to: number) => {
        if (from === to) return;
        const updated = [...workouts];
        const movedItem = updated.splice(from, 1)[0];
        updated.splice(to, 0, movedItem);
        setWorkouts(updated);
    };

    const moveAndReset = (from: number, to: number) => {
        move(from, to);
        requestAnimationFrame(() => {
            activeId.value = null;
            displacedMap.value = {};
        });
    };

    const renderItem = (item: Workout, index: number) => {
        const gesture = Gesture.Pan()
            .onStart((e) => {
                activeId.value = item.id;
                grabOffsetY.value = e.y;
                translateY.value = index * ITEM_HEIGHT;
                originalIndex.value = index;
                displacedMap.value = {};
            })
            .onUpdate((e) => {
                const currentY = e.absoluteY - grabOffsetY.value;
                translateY.value = currentY;

                const dragIndex = originalIndex.value;
                const dragTop = currentY;
                const dragBottom = currentY + ITEM_HEIGHT;

                workouts.forEach((otherItem, otherIndex) => {
                    if (otherItem.id === item.id) return;

                    const targetTop = otherIndex * ITEM_HEIGHT;
                    const targetBottom = targetTop + ITEM_HEIGHT;

                    const overlap = Math.max(0, Math.min(dragBottom, targetBottom) - Math.max(dragTop, targetTop));
                    const overlapRatio = overlap / ITEM_HEIGHT;

                    const startedBelow = dragIndex > otherIndex;

                    const isOverlappingEnough = overlapRatio >= 0.5;

                    // Add to displacement if overlapping enough and not already displaced
                    if (
                        isOverlappingEnough &&
                        !displacedMap.value[otherItem.id]
                    ) {
                        const direction = startedBelow ? 'down' : 'up';
                        displacedMap.value = {
                            ...displacedMap.value,
                            [otherItem.id]: direction,
                        };
                    }

                    // Revert displacement if overlap has dropped below threshold
                    if (displacedMap.value[otherItem.id]) {
                        const dir = displacedMap.value[otherItem.id];
                        const draggedPast =
                            (dir === 'up' && dragBottom < targetTop + ITEM_HEIGHT / 2) ||
                            (dir === 'down' && dragTop > targetBottom - ITEM_HEIGHT / 2);

                        if (draggedPast) {
                            const newMap = { ...displacedMap.value };
                            delete newMap[otherItem.id];
                            displacedMap.value = newMap;
                        }
                    }
                });
            })

            .onEnd(() => {
                const finalIndex = Math.round(translateY.value / ITEM_HEIGHT);

                runOnJS(moveAndReset)(originalIndex.value, finalIndex);
            })

        const animatedStyle = useAnimatedStyle(() => {
            const isActive = activeId.value === item.id;
            const baseIndex = workouts.findIndex((w) => w.id === item.id);
            const baseY = baseIndex * ITEM_HEIGHT;

            let displacement = 0;
            if (displacedMap.value[item.id] === 'up') displacement = -ITEM_HEIGHT;
            else if (displacedMap.value[item.id] === 'down') displacement = ITEM_HEIGHT;

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
                            : activeId.value === null
                                ? baseY + displacement // No animation after release
                                : withTiming(baseY + displacement), // Animate during drag
                    },
                ],
            };
        });

        return (
            <GestureDetector key={item.id} gesture={gesture}>
                <Animated.View style={[styles.item, animatedStyle]}>
                    <Text style={styles.text}>{item.title}</Text>
                </Animated.View>
            </GestureDetector>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingTop: 40 }}>
                {workouts.map((item, index) => renderItem(item, index))}
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    item: {
        height: ITEM_HEIGHT - 10,
        marginBottom: 10,
        marginHorizontal: 20,
        backgroundColor: '#000',
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
