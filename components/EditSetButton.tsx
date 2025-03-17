import { View, Text } from 'react-native';
import React from 'react';
import { colors, editButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EditSetButton(props: { line?: boolean }) {

    const { line } = props;

    return (
        <>  
            <View style={editButton.wrapper}>
                <View style={editButton.content}>
                    <View style={editButton.titleWrapper}>
                        <Text style={editButton.title}>Set 1</Text>
                        <MaterialIcons name="remove-circle" size={26} color={colors.secondText} />
                    </View>
                    <View style={editButton.notesWrapper}>
                        <Text style={editButton.notes}>Notes</Text>
                    </View>
                    <View style={editButton.settingsWrapper}>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>75</Text>
                            </View>
                            <Text style={editButton.inputTitle}>Weight</Text>
                        </View>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>3</Text>
                            </View>
                            <Text style={editButton.inputTitle}>RIR</Text>
                        </View>
                    </View>
                </View>
            </View>
            {line && (<View style={editButton.dividerLine}></View>)}
        </>
    )
}