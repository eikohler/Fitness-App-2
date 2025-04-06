import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useLayoutEffect, useRef } from 'react';
import { colors, fonts } from '@/styles/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header(props: {
    title: string; 
    subtext: string; 
    headerHeight: number;
    updateHeaderHeight: (height: number)=>void;
    notes?: string; 
    bolt?: boolean; 
    modal?: boolean; 
    backBtn?: boolean;
    editURL?: Href;
}) {

    const { title, subtext, notes, bolt, modal, backBtn, editURL, updateHeaderHeight, headerHeight } = props;
    const navigation = useNavigation();

    const fixedTitle = title.replace(" ", "  ");

    const headerRef = useRef<any>(null);

    useLayoutEffect(() => {
        headerRef.current?.measure((x:number, y:number, width:number, height:number) => updateHeaderHeight(height));        
    }, []);

    return (
        <View ref={headerRef} style={[styles.container, {
                boxShadow: modal ? "0px 5px 5px #000074" : "0px 5px 5px #0D0D0D",
                paddingTop: modal ? 50 : 60
            }]}>
            <LinearGradient colors={modal ? [colors.modalBG, 'rgba(0, 0, 116, 0.85)'] : ['#0D0D46', 'rgba(13, 13, 13, 0.85)']} 
            style={[styles.background, {height: headerHeight}]} />
            <View style={styles.layout}>
                <View style={styles.wrapper}>
                    <View style={styles.content}>
                        {backBtn && (
                            <Pressable style={[styles.backButton, {
                                boxShadow: modal ? "-4 4 0 #353693": "-4 4 0 #3E3F48"}]} 
                                onPress={() => navigation.goBack()}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        width: "100%",
    },
    background: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%"
    },
    layout: {
        width: "90%",
        marginHorizontal: "auto"
    },
    wrapper: {                
        display: "flex",
        flexDirection: 'row',
        alignItems: "flex-end",
        justifyContent: "space-between",
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
    },
    backButton: {
        backgroundColor: colors.backButtonBG,
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        marginBottom: 6
    }
});