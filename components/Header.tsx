import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { backButton, colors, fonts } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function Header(props: {title: string, subtext: string, notes?: string, bolt?: boolean, backBtn?: boolean}) {

    const { title, subtext, notes, bolt, backBtn } = props;
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
                            <Text style={[styles.subText, bolt && styles.weekText]}>{subtext}</Text>
                            {bolt && <MaterialIcons name="bolt" size={18} color={colors.weekText} />}
                        </View>
                        <Text style={styles.title}>{fixedTitle}</Text>
                    </View>
                </View>
                <MaterialIcons style={{marginBottom: 3}} name="edit" size={30} color={colors.primaryText} />
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
    weekText: {
        color: colors.weekText,
        marginRight: -2
    },
    notesText: {
        paddingTop: 10,
        color: colors.secondText,
        fontSize: 14,
        fontFamily: fonts.mainFont
    }
});