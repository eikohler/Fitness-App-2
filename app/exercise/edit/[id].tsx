import { Dimensions, LayoutChangeEvent, ScrollView, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import PlusButton from '@/components/PlusButton'
import EditSetButton from '@/components/EditSetButton'
import LargeButton from '@/components/LargeButton'
import { useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { SingleWorkoutExercise } from '@/Interfaces/exercises'
import { getSingleWorkoutExercise } from '@/utilities/dbFunctions'

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

  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeaderHeight = (height: number) => setHeaderHeight(height);

  if (!data) return null;

  return (
    <>
      <Header headerHeight={headerHeight} updateHeaderHeight={updateHeaderHeight}
        title={data.title} subtext={`${data.set_count} SETS / ${data.rep_count} REPS`} modal backBtn />

      <ModalBar />

      <ScrollView contentContainerStyle={[mainStyles.wrapper, { paddingTop: headerHeight }]}
        showsVerticalScrollIndicator={false}>

        <View style={mainStyles.buttonsList}>

          {Array.from({ length: data.set_count }).map((x, i) =>
            <EditSetButton key={i + 1} exID={data.id} sets={i + 1}
              reps={data.rep_count} line={i + 1 < data.set_count} />
          )}

          <PlusButton modal />

        </View>

        <LargeButton text="Save Exercise" />

      </ScrollView>
    </>
  )
}