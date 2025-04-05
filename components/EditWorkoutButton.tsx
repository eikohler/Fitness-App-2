import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, editButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { SingleWorkout } from '@/Interfaces/dataTypes';
import { getSingleWorkout } from '@/utilities/db-functions';

export default function EditWorkoutButton(props: { id: number, line?: boolean }) {

  const { id, line } = props;

  const db = useSQLiteContext();

  const [data, setData] = useState<SingleWorkout | undefined>();

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
    <>
      <View style={[editButton.wrapper, { alignItems: "flex-end" }]}>
        <MaterialIcons name="remove-circle" size={30} color={colors.secondText} />
        <View style={editButton.content}>
          <Text style={editButton.title}>{data.title}</Text>
          <View style={editButton.notesWrapper}>
            <Text style={editButton.notes}>{data.note ? data.note : "NOTES"}</Text>
          </View>
        </View>
        <MaterialIcons name="menu" size={32} color={colors.secondText} />
      </View>
      {line && (<View style={editButton.dividerLine}></View>)}
    </>
  )
}