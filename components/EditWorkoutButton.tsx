import { View, TextInput, Pressable } from 'react-native';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { colors, editButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { SingleWorkout } from '@/Interfaces/exercises';
import { getSingleWorkout } from '@/utilities/dbFunctions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type EditWorkoutRef = {
  getValues: () => { index: number, title: string; note: string; height: number; buttonWrapperY: number; };
  measure: (callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void) => void;
};

const EditWorkoutButton = forwardRef<EditWorkoutRef, {
  id: number,
  index: number,
  handleRemoveWorkout: (id: number) => void,
  updateTextFocused: (index: number) => void,
  handleDragUpdate: (pageY: number, direction: number, height: number, index: number) => void
}>((props, ref) => {

  const { id, index, handleRemoveWorkout, updateTextFocused, handleDragUpdate } = props;

  const db = useSQLiteContext();

  const buttonRefWrapper = useRef<View>(null);
  const buttonRef = useRef<View>(null);

  const [data, setData] = useState<SingleWorkout | null>(null);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const [height, setHeight] = useState(0);
  const [buttonWrapperY, setButtonWrapperY] = useState(0);

  useEffect(() => {
    getSingleWorkout(db, id)
      .then((res) => {
        if (res) setData(res);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (data) {
      if (data.note) setNote(data.note);
      if (data.title) setTitle(data.title);
    }
  }, [data]);

  useEffect(() => {
    buttonRef.current?.measure((x, y, width, height) => setHeight(height));
  }, [buttonRef]);

  const handleWraperLayoutChange = () => {
    buttonRefWrapper.current?.measure((x, y, width, height, pageX, pageY) => setButtonWrapperY(pageY));
  }

  useImperativeHandle(ref, () => ({
    getValues: () => ({ index, title, note, height, buttonWrapperY }),
    measure: (callback) => {
      buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
        callback(x, y, width, height, pageX, pageY);
      });
    }
  }));

  const buttonY = useSharedValue(0);
  const [dragActive, setDragActive] = useState(false);

  const longPressGesture = Gesture.LongPress()
    .minDuration(300) // press-and-hold time
    .onStart(() => {
      runOnJS(setDragActive)(true);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newY = e.absoluteY - (buttonWrapperY + height + (height / 2));
      const direction = newY - buttonY.value;
      buttonY.value = newY;
      runOnJS(handleDragUpdate)(buttonWrapperY + buttonY.value, direction, height, index);
    })
    .onEnd(() => {
      buttonY.value = withSpring(0, {
        damping: 15,      // Increase this to reduce bounce
        overshootClamping: false, // Prevent it from going past the target
      });
      runOnJS(setDragActive)(false);
    });

  const dragGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({ 
    top: buttonY.value, 
    zIndex: dragActive ? 2 : 1,
    opacity: dragActive ? 0.5 : 1,
    position: "absolute"
  }));

  return (
    <View ref={buttonRefWrapper} style={{backgroundColor: "purple", height: height}} onLayout={handleWraperLayoutChange}>
      <Animated.View ref={buttonRef} style={[editButton.wrapper, { alignItems: "center" }, animatedStyle]}>
        <View style={editButton.icons}>
          <Pressable onPress={() => handleRemoveWorkout(id)}>
            <MaterialIcons name="remove-circle" size={30} color={colors.secondText} />
          </Pressable>
        </View>

        <View style={editButton.content}>
          <TextInput
            onFocus={() => updateTextFocused(index)}
            onBlur={() => updateTextFocused(-1)}
            style={editButton.title}
            maxLength={20}
            onChangeText={setTitle}
            value={title}
            placeholder="WORKOUT"
            placeholderTextColor={colors.secondText}
            selectionColor={colors.weekText}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
          />
          <SafeAreaView style={editButton.notesWrapper}>
            <TextInput
              onFocus={() => updateTextFocused(index)}
              onBlur={() => updateTextFocused(-1)}
              style={editButton.notes}
              maxLength={100}
              multiline
              onChangeText={setNote}
              value={note}
              placeholder="Notes"
              placeholderTextColor={colors.secondText}
              returnKeyType="done"
              submitBehavior="blurAndSubmit"
            />
          </SafeAreaView>
        </View>

        <View style={editButton.icons}>
          <GestureDetector gesture={dragGesture}>
            <MaterialIcons style={{backgroundColor: 'green'}} name="menu" size={32} color={colors.secondText} />
          </GestureDetector>
        </View>
      </Animated.View>
    </View>
  );
});

export default EditWorkoutButton;
