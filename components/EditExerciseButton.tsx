import { View, Text } from 'react-native';
import React from 'react';
import { colors, editButton2 } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EditExerciseButton(props: { line?: boolean }) {

    const { line } = props;

    return (
        <>
            <View style={editButton2.wrapper}>
                <MaterialIcons name="remove-circle" size={30} color={colors.secondText} />
                <View style={editButton2.content}>
                    <Text style={editButton2.title}>Chest Press</Text>
                    <View style={editButton2.notesWrapper}>
                        <Text style={editButton2.notes}>Notes</Text>
                    </View>
                    <View style={editButton2.settingsWrapper}>
                        <View style={editButton2.setting}>
                            <View style={editButton2.inputWrapper}>
                                <Text style={editButton2.inputText}>4</Text>
                            </View>
                            <Text style={editButton2.inputTitle}>Sets</Text>
                        </View>
                        <View style={editButton2.setting}>
                            <View style={editButton2.inputWrapper}>
                                <Text style={editButton2.inputText}>8</Text>
                            </View>
                            <Text style={editButton2.inputTitle}>Reps</Text>
                        </View>
                    </View>
                </View>
                <MaterialIcons name="menu" size={32} color={colors.secondText} />
            </View>
            {line && (<View style={editButton2.dividerLine}></View>)}
        </>
    )
}