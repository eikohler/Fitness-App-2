import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { arrowButton, colors, mainStyles, toggleButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Workout } from '@/Interfaces/dataTypes';
import { getSingleWorkout } from '@/utilities/db-functions';
import { getDate } from '@/utilities/helpers';

export default function WorkoutButton(props: { id: number; }) {

  const { id } = props;

  const db = useSQLiteContext();

  const [data, setData] = useState<Workout | undefined>();

  useEffect(() => {
    getSingleWorkout(db, id)
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
      <Pressable style={arrowButton.wrapper} 
      onPress={() => router.push({ pathname: "/workout/[id]", params: { id: id } })}>
        <View>
          <Text style={arrowButton.subText}>{`${getDate(data.date)} / 4 EXERCISES`}</Text>
          <Text style={arrowButton.title}>{data.title}</Text>
        </View>
        <MaterialIcons name="arrow-forward" size={35} color={colors.primaryText} />
      </Pressable>
      <View style={toggleButton.wrapper}>
        <Text style={toggleButton.text}>DL</Text>
      </View>
    </View>
  )
}