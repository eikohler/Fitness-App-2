import { View, StyleSheet, TextInput, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/styles/Styles';

export default function LargeNumberField({
    updateIsFocusing,
    isFocusing,
    fieldName
}: {
    updateIsFocusing: (state: boolean) => void,
    isFocusing: boolean,
    fieldName: string
}) {
    const [value, setValue] = useState("");
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!isFocusing) inputRef.current?.blur();
    }, [isFocusing]);

    const handleChange = (text: string) => {
        const numeric = text.replace(/[^0-9.]/g, "");
        setValue(numeric);
    };

    return (
        <View style={styles.wrapper}>
            <TextInput
                ref={inputRef}
                onFocus={() => updateIsFocusing(true)}
                onBlur={() => updateIsFocusing(false)}
                style={styles.input}
                multiline
                keyboardType="number-pad"
                scrollEnabled={false}
                onChangeText={handleChange}
                value={value}
                placeholder="0"
                placeholderTextColor={colors.secondText}
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
        borderColor: "#fff",
        borderWidth: 1,
        padding: 10,
        textAlign: "center",
        color: colors.primaryText,
        fontSize: 35,
        fontWeight: "500"
    },
    fieldName: {
        color: colors.secondText,
        fontSize: 14,
        textAlign: "center",
        marginTop: 5
    }
});
