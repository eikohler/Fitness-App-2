import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import PlusButton from '@/components/PlusButton'
import EditSetButton from '@/components/EditSetButton'
import LargeButton from '@/components/LargeButton'
import { useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { SingleWorkoutExercise } from '@/Interfaces/dataTypes'
import { getSingleWorkoutExercise } from '@/utilities/db-functions'

export default function EditSingleExercise() {

  const urlParams = useLocalSearchParams() as { id: string };

  const db = useSQLiteContext();

  const [data, setData] = useState<SingleWorkoutExercise | undefined>();

  useEffect(() => {
    getSingleWorkoutExercise(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (!data) return "";

  return (
    <View style={mainStyles.wrapperModal}>
      <ModalBar />

      <Header title={data.title} subtext={`${data.set_count} SETS / ${data.rep_count} REPS`} modal backBtn />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>     

          {Array.from({ length: data.set_count }).map((x, i) =>
            <EditSetButton key={i + 1} exID={data.id} sets={i + 1} reps={data.rep_count} line={i+1 < data.set_count} />
          )}
          
          <PlusButton modal />
        </View>

        <LargeButton text="Save Exercise" />
      </View>

    </View>
  )
}