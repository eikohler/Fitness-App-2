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
  Easing,
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

  // Shared order of item IDs controls visual order during drag
  const order = useSharedValue(workouts.map((w) => w.id));

  const activeId = useSharedValue<number | null>(null);
  const translateY = useSharedValue(0);
  const grabOffsetY = useSharedValue(0);

  const renderItem = (item: Workout) => {
    const gesture = Gesture.Pan()
      .onStart((e) => {
        activeId.value = item.id;
        grabOffsetY.value = e.y;
        const currentIndex = order.value.findIndex((id) => id === item.id);
        translateY.value = currentIndex * ITEM_HEIGHT;
      })
      .onUpdate((e) => {
        const currentY = e.absoluteY - grabOffsetY.value;
        translateY.value = currentY;

        const dragIndex = order.value.findIndex((id) => id === item.id);
        const newIndex = Math.min(
          order.value.length - 1,
          Math.max(0, Math.floor((currentY + ITEM_HEIGHT / 2) / ITEM_HEIGHT))
        );

        if (newIndex !== dragIndex) {
          const newOrder = [...order.value];
          newOrder.splice(dragIndex, 1);
          newOrder.splice(newIndex, 0, item.id);
          order.value = newOrder;

          runOnJS(setWorkouts)(newOrder.map((id) => workouts.find((w) => w.id === id)!));
        }
      })
      .onEnd(() => {
        activeId.value = null;
        translateY.value = withTiming(
          order.value.findIndex((id) => id === item.id) * ITEM_HEIGHT,
          {
            duration: 300,
            easing: Easing.out(Easing.exp),
          }
        );
      });

    const animatedStyle = useAnimatedStyle(() => {
      const isActive = activeId.value === item.id;
      const indexInOrder = order.value.findIndex((id) => id === item.id);
      const baseY = indexInOrder * ITEM_HEIGHT;

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
              : withTiming(baseY, { duration: 800, easing: Easing.out(Easing.exp) }),
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
        {workouts.map((item) => renderItem(item))}
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
