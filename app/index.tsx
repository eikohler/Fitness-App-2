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
    const listPadding = 20;

    const [listA, setListA] = useState<Workout[]>(initialWorkout1);
    const [listB, setListB] = useState<Workout[]>(initialWorkout2);

    // Use shared values for layouts
    const layoutA = useSharedValue<LayoutRectangle | null>(null);
    const layoutB = useSharedValue<LayoutRectangle | null>(null);

    const orderA = useSharedValue<number[]>(initialWorkout1.map(w => w.id));
    const orderB = useSharedValue<number[]>(initialWorkout2.map(w => w.id));

    const activeId = useSharedValue<number | null>(null);
    const translateY = useSharedValue(0);
    const activeList = useSharedValue<ListType>('A');    

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

        if (currentList === 'A') {
            orderA.value = updatedSource.map(w => w.id);
            orderB.value = updatedDest.map(w => w.id);

            setListA(updatedSource);
            setListB(updatedDest);
        } else {
            orderA.value = updatedDest.map(w => w.id);
            orderB.value = updatedSource.map(w => w.id);

            setListA(updatedDest);
            setListB(updatedSource);
        }

        translateY.value = updatedDest.length * ITEM_HEIGHT - ITEM_HEIGHT;

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
            const isActive = activeId.value === item.id;
            const currentIndex = order.value.indexOf(item.id);
            const targetY = currentIndex * ITEM_HEIGHT + listPadding;

            return {
                position: 'absolute',
                top: 0,
                left: listPadding,
                right: listPadding,
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
                if(!layout || !layout.value) return;

                activeId.value = item.id;
                activeList.value = listType;

                const touchY = e.absoluteY;

                translateY.value = touchY - (ITEM_HEIGHT / 2) - layout.value.y;
            })
            .onUpdate(e => {
                if(!layout || !layout.value) return;

                const currentY = e.absoluteY;

                translateY.value = currentY - (ITEM_HEIGHT / 2) - layout.value.y;

                console.log("Current Y: ", currentY, "Translate Y: ", translateY.value);

                const currentIndex = order.value.indexOf(item.id);
                const newIndex = Math.max(0, Math.min(
                    Math.floor((currentY - layout.value.y - listPadding) / ITEM_HEIGHT),
                    order.value.length - 1
                ));

                if (newIndex !== currentIndex) {
                    const newOrder = [...order.value];
                    newOrder.splice(currentIndex, 1);
                    newOrder.splice(newIndex, 0, item.id);
                    order.value = newOrder;
                }
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

        return (
            <View
                onLayout={e => {
                    const layout = e.nativeEvent.layout;
                    if (listType === 'A') {
                        layoutA.value = layout;
                    } else {
                        layoutB.value = layout;
                    }
                }}
                style={{
                    height: newOrder.length * ITEM_HEIGHT + (listPadding * 2), 
                    minHeight: ITEM_HEIGHT + (listPadding * 2),
                    borderColor: "#fff", borderRadius: 20, borderWidth: 2
                }}>
                {newOrder.map((item) => (
                    <WorkoutItem
                        key={item.id}
                        item={item}
                        listType={listType}
                        order={order}
                        layout={listType === 'A' ? layoutA : layoutB}
                    />
                ))}
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 70 }}>
            <Text style={styles.heading}>List A</Text>
            {renderList(listA, orderA, 'A')}

            <Text style={[styles.heading, {marginTop: 40}]}>List B</Text>
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
