import { View, Text } from 'react-native';
import React from 'react';
import { arrowButton, colors, mainStyles, toggleButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function WorkoutButton() {
  return (
    <View style={mainStyles.buttonsWrapper}>
        <View style={arrowButton.wrapper}>
            <View>
                <Text style={arrowButton.subText}>FEB. 24 / 4 EXERCISES</Text>
                <Text style={arrowButton.title}>Push</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={35} color={colors.primaryText} />
        </View>
        <View style={toggleButton.wrapper}>
            <Text style={toggleButton.text}>DL</Text>
        </View>
    </View>
  )
}