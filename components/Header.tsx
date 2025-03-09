import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Header(props: {title: string, subtext: string, bolt?: boolean}) {

    const { title, subtext, bolt } = props;

    return (
        <View style={styles.wrapper}>
            <View>
                <View style={styles.subTextWrapper}>
                    <Text style={[styles.subText, bolt && styles.weekText]}>{subtext}</Text>
                    {bolt && <MaterialIcons name="bolt" size={18} color={colors.weekText} />}
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <MaterialIcons style={{marginBottom: 1}} name="edit" size={30} color={colors.primaryText} />
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
        alignItems: "center"
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
    }
});