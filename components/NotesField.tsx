import { StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/styles/Styles';

const START_HEIGHT = 65;

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

    useEffect(() => {
        if (!isFocusing) inputRef.current?.blur();
    }, [isFocusing]);

    return (
        <TextInput
            ref={inputRef}
            onFocus={() => updateIsFocusing(true)}
            onBlur={() => updateIsFocusing(false)}
            style={[styles.input, { minHeight: height }]}
            multiline
            scrollEnabled={false}
            onChangeText={setValue}
            value={value}
            placeholder="Notes"
            placeholderTextColor={colors.secondText}
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
        borderColor: "#fff",
        borderWidth: 1,
        padding: 10,
        color: colors.primaryText,
        fontSize: 16,
    },
});
