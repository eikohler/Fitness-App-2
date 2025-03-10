import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { arrowButton, colors, mainStyles, toggleButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

export default function WorkoutButton() {

  return (
    <View style={mainStyles.buttonsWrapper}>
        <Pressable style={arrowButton.wrapper} onPress={() => router.push({pathname: "/workout/[id]", params: {id: 1}})}>
            <View>
                <Text style={arrowButton.subText}>FEB. 24 / 4 EXERCISES</Text>
                <Text style={arrowButton.title}>Push</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={35} color={colors.primaryText} />
        </Pressable>
        <View style={toggleButton.wrapper}>
            <Text style={toggleButton.text}>DL</Text>
        </View>
    </View>
  )
}