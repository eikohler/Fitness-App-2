import { View, Text } from 'react-native'
import React from 'react'
import ModalBar from '@/components/ModalBar'
import { largeButton, mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import PlusButton from '@/components/PlusButton'
import EditExerciseButton from '@/components/EditExerciseButton'

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

        <View style={largeButton.wrapper}>
          <Text style={largeButton.text}>Save Workout</Text>
        </View>
      </View>

    </View>
  )
}