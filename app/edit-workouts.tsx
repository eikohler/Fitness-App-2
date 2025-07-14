import React, { useState } from 'react';
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
const initialWorkouts: Workout[] = [
  { id: 1, title: 'Push Day' },
  { id: 2, title: 'Pull Day' },
  { id: 3, title: 'Leg Day' },
  { id: 4, title: 'Core Day' },
  { id: 5, title: 'Mobility' },
];

type ListType = 'A' | 'B';

export default function EditWorkouts() {
  const [listA, setListA] = useState<Workout[]>(initialWorkouts);
  const [listB, setListB] = useState<Workout[]>([]);

  // Use shared values for layouts
  const layoutA = useSharedValue<LayoutRectangle | null>(null);
  const layoutB = useSharedValue<LayoutRectangle | null>(null);

  // Separate shared offsets for lists
  const listTopOffsetA = useSharedValue(0);
  const listTopOffsetB = useSharedValue(0);

  const orderA = useSharedValue<number[]>(initialWorkouts.map(w => w.id));
  const orderB = useSharedValue<number[]>([]);

  const activeId = useSharedValue<number | null>(null);
  const translateY = useSharedValue(0);
  const grabOffsetY = useSharedValue(0);
  const originalIndex = useSharedValue(0);
  const activeList = useSharedValue<ListType>('A');

  const layoutReadyA = useSharedValue(false);
  const layoutReadyB = useSharedValue(false);

  const moveAndReset = () => {
    const reorder = (list: Workout[], order: number[]) =>
      order
        .map(id => list.find(w => w.id === id))
        .filter(Boolean) as Workout[];

    setListA(reorder(listA, orderA.value));
    setListB(reorder(listB, orderB.value));

    requestAnimationFrame(() => {
      activeId.value = null;
    });
  };

  const handleDrop = (x: number, y: number, item: Workout) => {
    const droppedInA =
      layoutA.value &&
      x >= layoutA.value.x &&
      x <= layoutA.value.x + layoutA.value.width &&
      y >= layoutA.value.y &&
      y <= layoutA.value.y + layoutA.value.height;

    const droppedInB =
      layoutB.value &&
      x >= layoutB.value.x &&
      x <= layoutB.value.x + layoutB.value.width &&
      y >= layoutB.value.y &&
      y <= layoutB.value.y + layoutB.value.height;

    const currentList = activeList.value;
    const sourceList = currentList === 'A' ? listA : listB;
    const destList = droppedInA ? 'A' : droppedInB ? 'B' : currentList;

    if (currentList === destList) return moveAndReset();

    const updateLists = () => {
      const updatedSource = sourceList.filter(w => w.id !== item.id);
      const updatedDest = (destList === 'A' ? listA : listB).concat(item);

      if (currentList === 'A') {
        setListA(updatedSource);
        setListB(updatedDest);
        orderA.value = updatedSource.map(w => w.id);
        orderB.value = updatedDest.map(w => w.id);
      } else {
        setListB(updatedSource);
        setListA(updatedDest);
        orderB.value = updatedSource.map(w => w.id);
        orderA.value = updatedDest.map(w => w.id);
      }
    };

    runOnJS(updateLists)();
    runOnJS(moveAndReset)();
  };

  const WorkoutItem = ({
    item,
    index,
    list,
    order,
  }: {
    item: Workout;
    index: number;
    list: ListType;
    order: SharedValue<number[]>;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const isActive = activeId.value === item.id;
      const currentIndex = order.value.indexOf(item.id);
      const targetY = currentIndex * ITEM_HEIGHT;

      return {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        zIndex: isActive ? 100 : 0,
        transform: [
          {
            translateY: isActive ? translateY.value : withTiming(targetY),
          },
        ],
      };
    });

    const gesture = Gesture.Pan()
      .onStart(e => {
        'worklet';

        const layout = list === 'A' ? layoutA.value : layoutB.value;
        const ready = list === 'A' ? layoutReadyA.value : layoutReadyB.value;
        const offset = list === 'A' ? listTopOffsetA.value : listTopOffsetB.value;

        if (!ready || !layout) {
          // layout not ready, ignore gesture start
          console.log('Layout not ready for', list);
          return;
        }

        activeId.value = item.id;
        originalIndex.value = index;
        activeList.value = list;

        const containerY = layout.y;
        const itemTopY = containerY + index * ITEM_HEIGHT;
        const itemCenterY = itemTopY + ITEM_HEIGHT / 2;

        const touchY = e.absoluteY;
        
        console.log({containerY, itemTopY, itemCenterY, touchY});

        grabOffsetY.value = touchY - itemCenterY;

        translateY.value = touchY - grabOffsetY.value - offset;
      })
      .onUpdate(e => {
        'worklet';

        const offset = list === 'A' ? listTopOffsetA.value : listTopOffsetB.value;

        const currentY = e.absoluteY - grabOffsetY.value - offset;
        translateY.value = currentY;

        const currentIndex = order.value.indexOf(item.id);
        const newIndex = Math.max(
          0,
          Math.min(
            Math.floor((currentY + ITEM_HEIGHT / 2) / ITEM_HEIGHT),
            order.value.length - 1
          )
        );

        if (newIndex !== currentIndex) {
          const newOrder = [...order.value];
          newOrder.splice(currentIndex, 1);
          newOrder.splice(newIndex, 0, item.id);
          order.value = newOrder;
        }
      })
      .onEnd(e => {
        runOnJS(handleDrop)(e.absoluteX, e.absoluteY, item);
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
    const ordered = order.value
      .map(id => list.find(w => w.id === id))
      .filter(Boolean) as Workout[];

    return (
      <View
        onLayout={e => {
          const layout = e.nativeEvent.layout;
          console.log('Measured layout for list', listType, layout);
          if (listType === 'A') {
            layoutA.value = layout;
            layoutReadyA.value = true;
            listTopOffsetA.value = layout.y;
          } else {
            layoutB.value = layout;
            layoutReadyB.value = true;
            listTopOffsetB.value = layout.y;
          }
        }}
        style={{ height: ordered.length * ITEM_HEIGHT }}
      >
        {ordered.map((item, index) => (
          <WorkoutItem
            key={item.id}
            item={item}
            index={index}
            list={listType}
            order={order}
          />
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: 70 }}>
      <Text style={styles.heading}>List A</Text>
      {renderList(listA, orderA, 'A')}

      <Text style={styles.heading}>List B</Text>
      {renderList(listB, orderB, 'B')}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
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
  heading: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
});
