import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import PlusButton from '@/components/PlusButton'
import EditExerciseButton from '@/components/EditExerciseButton'
import LargeButton from '@/components/LargeButton'
import { useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { IDList, SingleWorkout } from '@/Interfaces/exercises'
import { getSingleWorkout, getWorkoutExercises } from '@/utilities/dbFunctions'
import { parseDate } from '@/utilities/helpers'

export default function EditSingleWorkout() {

  const urlParams = useLocalSearchParams() as { id: string };

  const db = useSQLiteContext();

  const [data, setData] = useState<SingleWorkout | undefined>();
  const [workoutExercises, setWorkoutExercises] = useState<IDList[] | undefined>();

  useEffect(() => {
    getSingleWorkout(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch((err) => console.log(err));

    getWorkoutExercises(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setWorkoutExercises(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeaderHeight = (height: number) => setHeaderHeight(height);

  if (!data) return null;

  return (
    <>
      <Header headerHeight={headerHeight} updateHeaderHeight={updateHeaderHeight} 
      title={data.title} subtext={`${parseDate(data.date)} / ${data.exCount} EXERCISES`} modal backBtn />
      
      <ModalBar />

      <ScrollView contentContainerStyle={[mainStyles.wrapper, { paddingTop: headerHeight }]}
        showsVerticalScrollIndicator={false}>

        <View style={mainStyles.buttonsList}>
          {workoutExercises?.map((wex, i) =>
            <EditExerciseButton key={wex.id} id={wex.id} line={i + 1 < workoutExercises.length} />
          )}
          <PlusButton modal />
        </View>

        <LargeButton text="Save Workout" />

      </ScrollView>
    </>
  )
}