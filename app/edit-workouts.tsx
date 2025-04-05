import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import EditWorkoutButton from '@/components/EditWorkoutButton'
import PlusButton from '@/components/PlusButton'
import LargeButton from '@/components/LargeButton'
import { useSQLiteContext } from 'expo-sqlite'
import { IDList } from '@/Interfaces/dataTypes'
import { getWorkouts } from '@/utilities/db-functions'

export default function EditWorkouts() {

  const db = useSQLiteContext();
  
    const [workouts, setWorkouts] = useState<IDList[] | undefined>();
  
    useEffect(() => {
      getWorkouts(db)
        .then((res) => { 
          if (res){
            setWorkouts(res);
          } 
        })
        .catch((err) => console.log(err));
    }, []);

  return (
    <View style={mainStyles.wrapperModal}>
      <ModalBar />

      <Header title={'Workouts'} subtext={'Week 3'} bolt modal backBtn />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          {workouts?.map((w)=>
            <EditWorkoutButton key={w.id} id={w.id} />          
          )}
          <PlusButton modal />
        </View>

        <LargeButton text="Save Workouts" />
      </View>

    </View>
  )
}