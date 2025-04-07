import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, editButton } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { SetRow } from '@/Interfaces/dataTypes';
import { getSingleSet } from '@/utilities/db-functions';

export default function EditSetButton(props: { exID: number, sets: number, reps: number, line?: boolean }) {

    const { exID, sets, reps, line } = props;    

    const db = useSQLiteContext();

    const [data, setData] = useState<SetRow>();    

    useEffect(() => {
        getSingleSet(db, exID, sets, reps)
            .then((res) => {
                if (res) setData(res);
            })
            .catch((err) => console.log(err));
    }, []);

    if (!data) return "";

    return (
        <>
            <View style={editButton.wrapper}>
                <View style={editButton.content}>
                    <View style={editButton.titleWrapper}>
                        <Text style={editButton.title}>{`Set ${sets}`}</Text>
                        <MaterialIcons name="remove-circle" size={26} color={colors.secondText} />
                    </View>
                    <View style={editButton.notesWrapper}>
                        <Text style={editButton.notes}>{data.note ? data.note : "Notes"}</Text>
                    </View>
                    <View style={editButton.settingsWrapper}>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>{data.weight}</Text>
                            </View>
                            <Text style={editButton.inputTitle}>Weight</Text>
                        </View>
                        <View style={editButton.setting}>
                            <View style={editButton.inputWrapper}>
                                <Text style={editButton.inputText}>{data.rir}</Text>
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