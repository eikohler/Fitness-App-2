import { StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/styles/Styles';

export default function TitleField({
    updateIsFocusing,
    isFocusing
}: {
    updateIsFocusing: (state: boolean) => void,
    isFocusing: boolean
}) {
    const [value, setValue] = useState("");
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!isFocusing) inputRef.current?.blur();
    }, [isFocusing]);

    return (
        <TextInput
            ref={inputRef}
            onFocus={() => updateIsFocusing(true)}
            onBlur={() => updateIsFocusing(false)}
            style={styles.input}
            scrollEnabled={false}
            onChangeText={setValue}
            value={value}
            placeholder="Exercise Name"
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
        fontWeight: "700"
    }
});
