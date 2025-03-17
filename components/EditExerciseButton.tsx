import { View, Text } from 'react-native';
import React from 'react';
import { colors, editButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EditExerciseButton(props: { line?: boolean }) {

    const { line } = props;

    return (
        <>
            <View style={editButton.wrapper}>
                <MaterialIcons name="remove-circle" size={30} color={colors.secondText} />
                <View style={editButton.content}>
                    <Text style={editButton.title}>Chest Press</Text>
                    <View style={editButton.notesWrapper}>
                        <Text style={editButton.notes}>Notes</Text>
                    </View>
                    <View style={editButton.settingsWrapper}>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>4</Text>
                            </View>
                            <Text style={editButton.inputTitle}>Sets</Text>
                        </View>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>8</Text>
                            </View>
                            <Text style={editButton.inputTitle}>Reps</Text>
                        </View>
                    </View>
                </View>
                <MaterialIcons name="menu" size={32} color={colors.secondText} />
            </View>
            {line && (<View style={editButton.dividerLine}></View>)}
        </>
    )
}