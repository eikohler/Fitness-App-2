import { View, TextInput, Pressable } from 'react-native';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { colors, editButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { SingleWorkout } from '@/Interfaces/dataTypes';
import { getSingleWorkout } from '@/utilities/db-functions';
import { SafeAreaView } from 'react-native-safe-area-context';

export type EditWorkoutRef = {
  getValues: () => { title: string; note: string };
  measure: (callback: (x: number, y: number) => void) => void;
};

const EditWorkoutButton = forwardRef<EditWorkoutRef, {
  id: number,
  index: number,
  handleRemoveWorkout: (id: number) => void,
  updateTextFocused: (index: number) => void
}>((props, ref) => {
  const { id, index, handleRemoveWorkout, updateTextFocused } = props;

  const db = useSQLiteContext();
  
  const viewRef = useRef<View>(null);

  const [data, setData] = useState<SingleWorkout | null>(null);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

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

  useImperativeHandle(ref, () => ({
    getValues: () => ({ title, note }),
    measure: (callback) => {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        callback(x, y);
      });
    }
  }));

  return (
    <View ref={viewRef} style={[editButton.wrapper, { alignItems: "center" }]}>
      <Pressable onPress={() => handleRemoveWorkout(id)}>
        <MaterialIcons style={editButton.icons} name="remove-circle" size={30} color={colors.secondText} />
      </Pressable>

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

      <MaterialIcons style={editButton.icons} name="menu" size={32} color={colors.secondText} />
    </View>
  );
});

export default EditWorkoutButton;
