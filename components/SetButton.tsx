import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts } from '@/styles/Styles';
import { useSQLiteContext } from 'expo-sqlite';
import { type SetRow } from '@/Interfaces/dataTypes';
import { getSetRow } from '@/utilities/db-functions';
import { getDateDiffInDays } from '@/utilities/helpers';

export default function SetButton(props: { exID: number, sets: number, reps: number }) {

    const { exID, sets, reps } = props;

    const nowDate = new Date("Fri, 03 Apr 2025 05:03:36 GMT");
    const nowUTC = nowDate.toUTCString();

    const db = useSQLiteContext();

    const [data, setData] = useState<SetRow[]>();
    const [diffInDays, setDiffInDays] = useState(0);
    const [firstSet, setFirstSet] = useState<SetRow>();
    const [secondSet, setSecondSet] = useState<SetRow>();

    useEffect(() => {
        getSetRow(db, exID, sets, reps)
            .then((res) => {
                if (res) setData(res);                  
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(()=>{
        if(data && data[0]){
            const diff = getDateDiffInDays(data[0].date, nowUTC);
            setDiffInDays(diff);
            setFirstSet(data[0]);        
            if(data[1] && diff <= 0){
                setFirstSet(data[1]);                
                setSecondSet(data[0]);
            }
        }
    }, [data])

    const FirstSet = () => {                
        if(firstSet) return (
            <View style={{flex: 1}}>
                <Pressable style={[styles.button, styles.firstSet]}>
                    <Text style={styles.title}>{sets}</Text>
                    <Text style={[styles.weight, styles.firstSetText]}>{firstSet.weight}</Text>
                    <Text style={[styles.rir, styles.firstSetText]}>{`RIR ${firstSet.rir}`}</Text>
                </Pressable>
                {firstSet.note && <Text style={styles.notes}>{firstSet.note}</Text>}
            </View>
        );

        return (
            <Pressable style={[styles.button, styles.logSet]}>
                <Text style={styles.title}>{sets}</Text>
                <Text style={styles.logSetText}>LOG SET</Text>
            </Pressable>
        );
    }

    const SecondSet = () => {
        if(secondSet) return (
            <View style={{flex: 1}}>
                <Pressable style={[styles.button, styles.secondSet]}>
                    <Text style={[styles.weight, styles.secondSetText]}>{secondSet.weight}</Text>
                    <Text style={[styles.rir, styles.secondSetText]}>{`RIR ${secondSet.rir}`}</Text>
                </Pressable>
                {secondSet.note && <Text style={styles.notes}>{secondSet.note}</Text>}
            </View>            
        );

        if(firstSet && diffInDays > 0) return (
            <Pressable style={[styles.button, styles.logSet]}>
                <Text style={styles.logSetText}>LOG SET</Text>
            </Pressable>
        );

        return null;
    }

    if(!data) return null;

    return (
        <View style={styles.wrapper}>
            <View style={styles.buttonsWrapper}>
                <FirstSet />
                <SecondSet />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        gap: 8
    },
    title: {
        paddingTop: 6,
        paddingLeft: 8,
        color: colors.secondText,
        fontSize: 14,
        fontFamily: fonts.mainFont,
        position: "absolute",
        top: 0,
        left: 0
    },
    titleText: {
    },
    buttonsWrapper: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    button: {
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 8,
        paddingHorizontal: 12,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 5,
    },
    firstSet: {
        backgroundColor: colors.firstSetBG,
        position: "relative",
        overflow: "hidden"
    },
    secondSet: {
        backgroundColor: colors.secondSetBG
    },
    logSet: {
        backgroundColor: "transparent",
        borderColor: colors.primaryText,
        borderWidth: 1,
        alignItems: "center",
        minHeight: 50,
        flex: 1
    },
    weight: {
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: 0.5,
        fontFamily: fonts.mainFont
    },
    rir: {
        letterSpacing: 0.5,
        fontSize: 18,
        marginBottom: 3,
        fontFamily: fonts.mainFont
    },
    firstSetText: {
        color: colors.primaryText
    },
    secondSetText: {
        color: colors.mainBG
    },
    logSetText: {
        fontSize: 20,
        fontWeight: 500,
        letterSpacing: 0.5,
        fontFamily: fonts.mainFont,
        color: colors.primaryText
    },
    notes: {
        color: colors.secondText,
        fontSize: 14,
        fontFamily: fonts.mainFont,
        paddingHorizontal: 5,
        marginTop: 5
    }
});