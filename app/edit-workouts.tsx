import { View } from 'react-native'
import React from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import EditWorkoutButton from '@/components/EditWorkoutButton'
import PlusButton from '@/components/PlusButton'
import LargeButton from '@/components/LargeButton'

export default function EditWorkouts() {
  return (
    <View style={mainStyles.wrapperModal}>
      <ModalBar />

      <Header title={'Workouts'} subtext={'Week 3'} bolt modal backBtn />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          <EditWorkoutButton/>
          <EditWorkoutButton/>
          <EditWorkoutButton/>
          <EditWorkoutButton/>
          <PlusButton modal />
        </View>

        <LargeButton text="Save Workouts" />
      </View>

    </View>
  )
}