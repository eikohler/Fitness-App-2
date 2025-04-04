import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { arrowButton, colors, mainStyles, toggleButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { type SingleWorkoutExercise } from '@/Interfaces/dataTypes';
import { getSingleWorkoutExercise } from '@/utilities/db-functions';

export default function ExerciseButton(props: { id: number }) {

  const { id } = props;

  const db = useSQLiteContext();

  const [data, setData] = useState<SingleWorkoutExercise | undefined>();

  useEffect(() => {
    getSingleWorkoutExercise(db, id)
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (!data) return "";

  return (
    <View style={mainStyles.buttonsWrapper}>
      <Pressable style={arrowButton.wrapper} onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: id } })}>
        <View>
          <Text style={arrowButton.subText}>{`${data.set_count} SETS / ${data.rep_count} REPS`}</Text>
          <Text style={arrowButton.title}>{data.title}</Text>
        </View>
        <MaterialIcons name="arrow-forward" size={35} color={colors.primaryText} />
      </Pressable>
      <View style={toggleButton.wrapper}>
        <Text style={toggleButton.text}>ALT</Text>
      </View>
    </View>
  )
}