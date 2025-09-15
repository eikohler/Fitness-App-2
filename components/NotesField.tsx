import { StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/styles/Styles';

const START_HEIGHT = 55;

export default function NotesField({
    updateIsFocusing,
    isFocusing
}: {
    updateIsFocusing: (state: boolean) => void,
    isFocusing: boolean
}) {
    const [height, setHeight] = useState(START_HEIGHT);
    const [value, setValue] = useState("");
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

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
        <TextInput
            ref={inputRef}
            onFocus={() => updateFocus(true)}
            onBlur={() => updateFocus(false)}
            style={[styles.input, { minHeight: height }]}
            multiline
            scrollEnabled={false}
            onChangeText={setValue}
            value={value}
            placeholder={"Notes"}
            placeholderTextColor={isFocused ? "transparent" : colors.softWhite}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            onContentSizeChange={(e) => {
                setHeight(Math.max(START_HEIGHT, e.nativeEvent.contentSize.height));
            }}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 10,
        borderColor: colors.white,
        borderWidth: 1,
        padding: 10,
        color: colors.white,
        fontSize: 16,
    },
});
