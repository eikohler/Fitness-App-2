import { View, StyleSheet, TextInput, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/styles/Styles';

export default function LargeNumberField({
    updateIsFocusing,
    isFocusing,
    fieldName,
    storedValue,
    updateStoredValue
}: {
    updateIsFocusing: (state: boolean) => void,
    isFocusing: boolean,
    fieldName: string,
    storedValue: string,
    updateStoredValue: (text: string) => void
}) {
    const [value, setValue] = useState("");
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (storedValue !== value) {
            setValue(storedValue);
        }
    }, [storedValue]);

    useEffect(() => {
        if (!isFocusing) inputRef.current?.blur();
    }, [isFocusing]);

    const handleChange = (text: string) => {
        const numeric = text.replace(/[^0-9.]/g, "");
        setValue(numeric);
        updateStoredValue(numeric);
    };

    useEffect(() => {
        if (!isFocusing) {
            inputRef.current?.blur();
            setIsFocused(false);
        }
    }, [isFocusing]);

    const updateFocus = (state: boolean) => {
        setIsFocused(state);
        updateIsFocusing(state);
    }

    return (
        <View style={styles.wrapper}>
            <TextInput
                ref={inputRef}
                onFocus={() => updateFocus(true)}
                onBlur={() => updateFocus(false)}
                style={styles.input}
                multiline
                keyboardType="number-pad"
                scrollEnabled={false}
                onChangeText={handleChange}
                value={value}
                placeholder={"0"}
                placeholderTextColor={isFocused ? "transparent" : colors.softWhite}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
            />
            <Text style={styles.fieldName}>{fieldName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    input: {
        borderRadius: 10,
        borderColor: colors.white,
        borderWidth: 1,
        padding: 10,
        textAlign: "center",
        color: colors.white,
        fontSize: 28,
        fontWeight: "600"
    },
    fieldName: {
        color: colors.softWhite,
        fontSize: 14,
        textAlign: "center",
        marginTop: 5
    }
});
