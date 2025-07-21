import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LayoutRectangle } from 'react-native';
import {
    GestureHandlerRootView,
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';
import Animated, {
    SharedValue,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 70;
const LIST_PADDING = 20;

type Workout = { id: number; title: string };
const initialWorkout1: Workout[] = [
    { id: 1, title: 'Push Day' },
    { id: 2, title: 'Pull Day' },
    { id: 3, title: 'Leg Day' },
];

const initialWorkout2: Workout[] = [
    { id: 4, title: 'Core Day' },
    { id: 5, title: 'Mobility' },
];

type ListType = 'A' | 'B';

export default function EditWorkouts() {

    const [listA, setListA] = useState<Workout[]>(initialWorkout1);
    const [listB, setListB] = useState<Workout[]>(initialWorkout2);

    // Use shared values for layouts
    const layoutA = useSharedValue<LayoutRectangle | null>(null);
    const layoutB = useSharedValue<LayoutRectangle | null>(null);

    const orderA = useSharedValue<number[]>(initialWorkout1.map(w => w.id));
    const orderB = useSharedValue<number[]>(initialWorkout2.map(w => w.id));

    const activeId = useSharedValue<number | null>(null);
    const translateY = useSharedValue(0);
    const activeList = useSharedValue<ListType | null>(null);

    const reorder = (list: Workout[], order: SharedValue<number[]>) =>
        order.value
            .map(id => list.find(w => w.id === id))
            .filter(Boolean) as Workout[];

    const moveAndReset = () => {
        setListA(reorder(listA, orderA));
        setListB(reorder(listB, orderB));

        requestAnimationFrame(() => {
            activeId.value = null;
        });
    };

    const handleHover = (currentY: number, item: Workout) => {
        const hoverA =
            layoutA.value &&
            currentY >= layoutA.value.y &&
            currentY <= layoutA.value.y + layoutA.value.height;

        const hoverB =
            layoutB.value &&
            currentY >= layoutB.value.y &&
            currentY <= layoutB.value.y + layoutB.value.height;

        const currentListID = activeList.value;

        const destListID = hoverA ? 'A' : hoverB ? 'B' : currentListID;
        const destOrder = currentListID === 'A' ? orderB : orderA;
        const destLayout = currentListID === 'A' ? layoutB : layoutA;

        console.log(destOrder.value);

        // IF the destination layout does NOT exist, return
        if (!destLayout.value) return;

        const cloneID = 0;
        const hasClone = destOrder.value.includes(cloneID);

        // IF does NOT have clone and NOT hovering the list, no action needed, return
        if (!hasClone && currentListID === destListID) return;

        // IF does have clone, but NOT hovering the list, remove the clone id from the destination order, return
        if (hasClone && currentListID === destListID) {
            destOrder.value = destOrder.value.filter(id => id !== cloneID); // Remove zero          
            return;
        }

        // IS hovering the desitination list, 
        // Add the clone IF not already in the destination order
        const newDestOrder = !hasClone ? [...destOrder.value, cloneID] : [...destOrder.value];

        // Update the clone's order position in the destination list
        const cloneIndex = newDestOrder.indexOf(cloneID); // Find the index of the clone
        const newCloneIndex = Math.max(0, Math.min(
            Math.floor((currentY - destLayout.value.y - LIST_PADDING) / ITEM_HEIGHT),
            newDestOrder.length - 1
        ));

        if (newCloneIndex !== cloneIndex) {
            newDestOrder.splice(cloneIndex, 1);
            newDestOrder.splice(newCloneIndex, 0, cloneID);
            destOrder.value = newDestOrder;
        }
    };

    const handleDrop = (currentY: number, item: Workout) => {
        const droppedInA =
            layoutA.value &&
            currentY >= layoutA.value.y &&
            currentY <= layoutA.value.y + layoutA.value.height;

        const droppedInB =
            layoutB.value &&
            currentY >= layoutB.value.y &&
            currentY <= layoutB.value.y + layoutB.value.height;

        const currentList = activeList.value;
        const sourceList = currentList === 'A' ? listA : listB;
        const destList = droppedInA ? 'A' : droppedInB ? 'B' : currentList;

        if (currentList === destList) return moveAndReset();

        const updatedSource = sourceList.filter(w => w.id !== item.id);
        const updatedDest = (destList === 'A' ? listA : listB).concat(item);

        const cloneID = 0;

        if (currentList === 'A') {
            orderA.value = updatedSource.map(w => w.id);

            const cloneIndex = orderB.value.indexOf(cloneID);
            const newOrder = [...orderB.value];
            newOrder[cloneIndex] = item.id;
            orderB.value = newOrder;

            setListA(updatedSource);
            setListB(updatedDest);

        } else {
            orderB.value = updatedSource.map(w => w.id);

            const cloneIndex = orderA.value.indexOf(cloneID);
            const newOrder = [...orderA.value];
            newOrder[cloneIndex] = item.id;
            orderA.value = newOrder;

            setListA(updatedDest);
            setListB(updatedSource);

            // translateY.value = cloneIndex * ITEM_HEIGHT + LIST_PADDING;
        }

        requestAnimationFrame(() => {
            activeId.value = null;
        });
    };

    const WorkoutItem = ({
        item,
        listType,
        order,
        layout
    }: {
        item: Workout;
        listType: ListType;
        order: SharedValue<number[]>;
        layout: SharedValue<LayoutRectangle | null>;
    }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const isActive = activeId.value === item.id && activeList.value === listType;
            const currentIndex = order.value.indexOf(item.id);
            const targetY = currentIndex * ITEM_HEIGHT + LIST_PADDING;

            return {
                position: 'absolute',
                top: 0,
                left: LIST_PADDING,
                right: LIST_PADDING,
                height: ITEM_HEIGHT,
                zIndex: isActive ? 100 : 0,
                opacity: isActive ? 0.8 : 1,
                backgroundColor: isActive ? '#2929c3ff' : '#000074',
                transform: [
                    {
                        translateY: isActive ? translateY.value : withTiming(targetY),
                    },
                ],
            };
        });

        const gesture = Gesture.Pan()
            .onStart(e => {
                if (!layout || !layout.value) return;

                activeId.value = item.id;
                activeList.value = listType;

                const touchY = e.absoluteY;

                translateY.value = touchY - (ITEM_HEIGHT / 2) - layout.value.y;
            })
            .onUpdate(e => {
                if (!layout || !layout.value) return;

                const currentY = e.absoluteY;

                translateY.value = currentY - (ITEM_HEIGHT / 2) - layout.value.y;

                // console.log("Current Y: ", currentY, "Translate Y: ", translateY.value);

                const currentIndex = order.value.indexOf(item.id);
                const newIndex = Math.max(0, Math.min(
                    Math.floor((currentY - layout.value.y - LIST_PADDING) / ITEM_HEIGHT),
                    order.value.length - 1
                ));

                if (newIndex !== currentIndex) {
                    const newOrder = [...order.value];
                    newOrder.splice(currentIndex, 1);
                    newOrder.splice(newIndex, 0, item.id);
                    order.value = newOrder;
                }

                runOnJS(handleHover)(e.absoluteY, item);
            })
            .onEnd(e => {
                runOnJS(handleDrop)(e.absoluteY, item);
            });

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.item, animatedStyle]}>
                    <Text style={styles.text}>{item.title}</Text>
                </Animated.View>
            </GestureDetector>
        );
    };

    const renderList = (
        list: Workout[],
        order: SharedValue<number[]>,
        listType: ListType
    ) => {

        const newOrder = reorder(list, order);

        const animatedStyle = useAnimatedStyle(() => {
            const height = order.value.length * ITEM_HEIGHT + (LIST_PADDING * 2);

            return {
                height: withTiming(height),
                minHeight: ITEM_HEIGHT + (LIST_PADDING * 2),
                borderColor: "#fff", borderRadius: 20, borderWidth: 2
            };
        });

        return (
            <Animated.View
                onLayout={e => {
                    const layout = e.nativeEvent.layout;
                    if (listType === 'A') {
                        layoutA.value = layout;
                    } else {
                        layoutB.value = layout;
                    }
                }}
                style={animatedStyle}>
                {newOrder.map((item, index) => (
                    <WorkoutItem
                        key={`${item.id}-${index}-${listType}`}
                        item={item}
                        listType={listType}
                        order={order}
                        layout={listType === 'A' ? layoutA : layoutB}
                    />
                ))}
            </Animated.View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 70 }}>
            <Text style={styles.heading}>List A</Text>
            {renderList(listA, orderA, 'A')}

            <Text style={[styles.heading, { marginTop: 40 }]}>List B</Text>
            {renderList(listB, orderB, 'B')}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
});
