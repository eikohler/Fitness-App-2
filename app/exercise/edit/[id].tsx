import { View } from 'react-native'
import React from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import PlusButton from '@/components/PlusButton'
import EditSetButton from '@/components/EditSetButton'
import LargeButton from '@/components/LargeButton'

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

        <LargeButton text="Save Exercise" />
      </View>

    </View>
  )
}