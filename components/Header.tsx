import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts, mainStyles } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface HeaderRequiredProps {
    title: string, 
    subtext: string
}

interface HeaderOptionalProps {
    bolt: boolean
}

interface HeaderProps extends HeaderRequiredProps, HeaderOptionalProps {}

const defaultProps: HeaderOptionalProps = {
    bolt: false
};

Header.defaultProps = defaultProps;

export default function Header(props: HeaderProps) {

    const { title, subtext, bolt } = props;

    return (
        <View style={[styles.wrapper, mainStyles.wrapper]}>
            <View>
                <View style={styles.subtextWrapper}>
                    <Text style={[styles.subtext, bolt && styles.weektext]}>{subtext}</Text>
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
        paddingTop: 80,
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
        fontSize: 28,
        textTransform: "uppercase",
        fontWeight: "900",
        fontStyle: "italic",
        fontFamily: fonts.mainFont,
        letterSpacing: -3
    },
    subtextWrapper: {
        marginBottom: 5,        
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    subtext: {
        fontFamily: fonts.mainFont,
        color: colors.primaryText,
        textTransform: "uppercase",
        fontSize: 16,
    },
    weektext: {
        color: colors.weekText,
        marginRight: -2
    }
});