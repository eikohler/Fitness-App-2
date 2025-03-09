import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, mainStyles } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function WorkoutButton() {
  return (
    <View style={mainStyles.buttonsWrapper}>
        <View style={mainStyles.arrowButton}>
            <View>
                <Text style={mainStyles.arrowButtonSubText}>FEB. 24 / 4 EXERCISES</Text>
                <Text style={mainStyles.arrowButtonTitle}>Push</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={35} color={colors.primaryText} />
        </View>
        <View style={mainStyles.toggleButton}>
            <Text style={mainStyles.toggleButtonText}>DL</Text>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
  
});