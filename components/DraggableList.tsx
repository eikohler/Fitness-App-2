import React, { useState, useEffect } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
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

type DraggableListProps<T extends string | number> = {
  data: T[]; // unique IDs for each item
  renderItem: (id: T) => React.ReactNode;
  itemHeight?: number;
  onOrderChange?: (newOrder: T[]) => void;
};

export function DraggableList<T extends string | number>({
  data,
  renderItem,
  itemHeight = 80,
  onOrderChange,
}: DraggableListProps<T>) {
  // Internal state mirrors data for rendering order
  const [orderState, setOrderState] = useState(data);

  // Shared order for animation and drag logic
  const order = useSharedValue(data);

  const activeId = useSharedValue<T | null>(null);
  const translateY = useSharedValue(0);
  const grabOffsetY = useSharedValue(0);

  // Sync order when data prop changes
  useEffect(() => {
    setOrderState(data);
    order.value = data;
  }, [data]);

  // Update React state and notify parent when order changes
  const updateOrder = (newOrder: T[]) => {
    setOrderState(newOrder);
    onOrderChange?.(newOrder);
  };

  const renderDraggableItem = (id: T) => {
    const gesture = Gesture.Pan()
      .onStart((e) => {
        activeId.value = id;
        grabOffsetY.value = e.y;
        const currentIndex = order.value.findIndex((itemId) => itemId === id);
        translateY.value = currentIndex * itemHeight;
      })
      .onUpdate((e) => {
        const currentY = e.absoluteY - grabOffsetY.value;
        translateY.value = currentY;

        const dragIndex = order.value.findIndex((itemId) => itemId === id);
        const newIndex = Math.min(
          order.value.length - 1,
          Math.max(0, Math.floor((currentY + itemHeight / 2) / itemHeight))
        );

        if (newIndex !== dragIndex) {
          const newOrder = [...order.value];
          newOrder.splice(dragIndex, 1);
          newOrder.splice(newIndex, 0, id);
          order.value = newOrder;

          runOnJS(updateOrder)(newOrder);
        }
      })
      .onEnd(() => {
        activeId.value = null;
        translateY.value = withTiming(
          order.value.findIndex((itemId) => itemId === id) * itemHeight,
          {
            duration: 300,
            easing: Easing.out(Easing.exp),
          }
        );
      });

    const animatedStyle = useAnimatedStyle(() => {
      const isActive = activeId.value === id;
      const indexInOrder = order.value.findIndex((itemId) => itemId === id);
      const baseY = indexInOrder * itemHeight;

      return {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: itemHeight,
        zIndex: isActive ? 100 : 0,
        transform: [
          {
            translateY: isActive
              ? translateY.value
              : withTiming(baseY, { duration: 300, easing: Easing.out(Easing.exp) }),
          },
        ],
      };
    });

    return (
      <GestureDetector key={id} gesture={gesture}>
        <Animated.View style={[styles.item, animatedStyle]}>
          {renderItem(id)}
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{ flex: 1, paddingTop: 40, position: 'relative', height: orderState.length * itemHeight }}
      >
        {orderState.map((id) => renderDraggableItem(id))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
