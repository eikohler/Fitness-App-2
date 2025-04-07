import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, editButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { SingleWorkoutExercise } from '@/Interfaces/dataTypes';
import { getSingleWorkoutExercise } from '@/utilities/db-functions';

export default function EditExerciseButton(props: { id: number, line?: boolean }) {

    const { id, line } = props;

    const db = useSQLiteContext();

    const [data, setData] = useState<SingleWorkoutExercise | undefined>();

    useEffect(() => {
        getSingleWorkoutExercise(db, id)
            .then((res) => {
                if (res) {
                    setData(res);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    if (!data) return "";

    return (
        <>
            <View style={editButton.wrapper}>
                <MaterialIcons name="remove-circle" size={30} color={colors.secondText} />
                <View style={editButton.content}>
                    <Text style={editButton.title}>{data.title}</Text>
                    <View style={editButton.notesWrapper}>
                        <Text style={editButton.notes}>{data.note ? data.note : "Notes"}</Text>
                    </View>
                    <View style={editButton.settingsWrapper}>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>{data.set_count}</Text>
                            </View>
                            <Text style={editButton.inputTitle}>Sets</Text>
                        </View>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>{data.rep_count}</Text>
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