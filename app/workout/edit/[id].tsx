import { View } from 'react-native'
import React from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import PlusButton from '@/components/PlusButton'
import EditExerciseButton from '@/components/EditExerciseButton'
import LargeButton from '@/components/LargeButton'

export default function EditSingleWorkout() {
  return (
    <View style={mainStyles.wrapperModal}>
      <ModalBar />

      <Header title={'Push'} subtext={'FEB. 24 / 4 EXERCISES'} modal backBtn />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          <EditExerciseButton line />
          <EditExerciseButton />
          <PlusButton modal />
        </View>

        <LargeButton text="Save Workout" />
      </View>

    </View>
  )
}