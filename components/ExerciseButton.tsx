import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { arrowButton, colors, mainStyles, toggleButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

export default function ExerciseButton() {

  return (
    <View style={mainStyles.buttonsWrapper}>
        <Pressable style={arrowButton.wrapper} onPress={() => router.push({pathname: "/exercise/[id]", params: {id: 1}})}>
            <View>
                <Text style={arrowButton.subText}>4 SETS / 8 REPS</Text>
                <Text style={arrowButton.title}>Chest Press</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={35} color={colors.primaryText} />
        </Pressable>
        <View style={toggleButton.wrapper}>
            <Text style={toggleButton.text}>ALT</Text>
        </View>
    </View>
  )
}