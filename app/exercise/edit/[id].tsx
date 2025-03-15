import { View, Text } from 'react-native'
import React from 'react'
import ModalBar from '@/components/ModalBar'
import { largeButton, mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import PlusButton from '@/components/PlusButton'
import EditSetButton from '@/components/EditSetButton'

export default function EditSingleExercise() {
  return (
    <View style={mainStyles.wrapperModal}>
      <ModalBar />

      <Header title={'Chest Press'} subtext={'4 SETS / 8 REPS'} modal backBtn />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          <EditSetButton line />
          <EditSetButton />
          <PlusButton modal />
        </View>

        <View style={largeButton.wrapper}>
          <Text style={largeButton.text}>Save Exercise</Text>
        </View>
      </View>

    </View>
  )
}