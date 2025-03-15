import { View, Text } from 'react-native';
import React from 'react';
import { colors, editButton1 } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EditWorkoutButton() {
  return (
    <View style={editButton1.wrapper}>
      <MaterialIcons name="remove-circle" size={30} color={colors.secondText} />
        <View style={editButton1.textWrapper}>
            <Text style={editButton1.text}>Push</Text>
        </View>
      <MaterialIcons name="menu" size={32} color={colors.secondText} />
    </View>
  )
}