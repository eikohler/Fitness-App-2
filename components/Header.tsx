import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { backButton, colors, fonts } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function Header(props: {
    title: string; 
    subtext: string; 
    notes?: string; 
    bolt?: boolean; 
    modal?: boolean; 
    backBtn?: boolean;
    editURL?: Href;
}) {

    const { title, subtext, notes, bolt, modal, backBtn, editURL } = props;
    const navigation = useNavigation();

    const fixedTitle = title.replace(" ", "  ");

    return (
        <View>
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    {backBtn && (
                        <Pressable style={backButton.wrapper} onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={28} color={colors.mainBG} />
                        </Pressable>
                    )}
                    <View>
                        <View  style={styles.subTextWrapper}>
                            <Text style={[styles.subText, bolt && {marginRight: -2, color: colors.weekText}, modal && {color: colors.primaryText}]}>{subtext}</Text>
                            {bolt && <MaterialIcons name="bolt" size={18} color={modal ? colors.primaryText : colors.weekText} />}
                        </View>
                        <Text style={styles.title}>{fixedTitle}</Text>
                    </View>
                </View>
                {editURL && (
                    <Pressable onPress={()=>router.push(editURL)}>
                        <MaterialIcons style={{marginBottom: 3}} name="edit" size={30} color={colors.primaryText} />
                    </Pressable>
                )}
            </View>
            { notes && (
                <Text style={styles.notesText}>{notes}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {                
        display: "flex",
        flexDirection: 'row',
        alignItems: "flex-end",
        justifyContent: "space-between",
        borderBottomColor: colors.primaryText,
        borderBottomWidth: 1,
        paddingBottom: 10        
    },
    content: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 20
    },
    title: {
        color: colors.primaryText,
        fontSize: 32,
        textTransform: "uppercase",
        fontWeight: "900",
        fontStyle: "italic",
        fontFamily: fonts.mainFont,
        letterSpacing: -3
    },
    subTextWrapper: {
        marginBottom: 5,        
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    subText: {
        fontFamily: fonts.mainFont,
        color: colors.secondText,
        textTransform: "uppercase",
        fontSize: 16,
    },
    notesText: {
        paddingTop: 10,
        color: colors.secondText,
        fontSize: 14,
        fontFamily: fonts.mainFont
    }
});