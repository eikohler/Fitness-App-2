import { StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/styles/Styles';

export default function TitleField({
    updateIsFocusing,
    isFocusing,
    updateTitleIsFocused,
    updateTitleValue,
    titleValue
}: {
    updateIsFocusing: (state: boolean) => void,
    isFocusing: boolean,
    updateTitleIsFocused: (state: boolean) => void,
    updateTitleValue: (text: string) => void,
    titleValue: string
}) {
    const [value, setValue] = useState("");
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (titleValue !== value) {
            setValue(titleValue);
        }
    }, [titleValue]);

    useEffect(() => {
        if (!isFocusing) {
            inputRef.current?.blur();
            setIsFocused(false);
            updateTitleIsFocused(false);
        }
    }, [isFocusing]);

    const updateFocus = (state: boolean) => {
        setIsFocused(state);
        updateIsFocusing(state);
        updateTitleIsFocused(state);
    }

    return (
        <TextInput
            ref={inputRef}
            onFocus={() => updateFocus(true)}
            onBlur={() => updateFocus(false)}
            style={[styles.input, {
                borderColor: isFocused ? colors.softWhite : "transparent",
                paddingBottom: isFocused ? 12 : 0
            }]}
            scrollEnabled={false}
            onChangeText={(e) => {
                setValue(e);
                updateTitleValue(e);
            }}
            value={value}
            placeholder={"Type exercise..."}
            placeholderTextColor={colors.softWhite}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
        />
    );
}

const styles = StyleSheet.create({
    input: {
        color: colors.white,
        fontSize: 25,
        fontWeight: "700",
        borderBottomWidth: 1,
        paddingBottom: 10
    }
});
