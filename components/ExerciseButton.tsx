import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { arrowButton, colors, mainStyles, toggleButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { type SingleWorkoutSingleExercise } from '@/Interfaces/dataTypes';
import { getSingleWorkoutSingleExercise } from '@/utilities/db-functions';

export default function ExerciseButton(props: {wID: number, exID: number}) {

  const {wID, exID} = props;

  const db = useSQLiteContext();
  
    const [data, setData] = useState<SingleWorkoutSingleExercise | undefined>();
  
    useEffect(() => {
      getSingleWorkoutSingleExercise(db, wID, exID)
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
        <Pressable style={arrowButton.wrapper} onPress={() => router.push({pathname: "/exercise/[id]", params: {id: 1}})}>
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