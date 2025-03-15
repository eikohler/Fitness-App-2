import { StyleSheet, View } from 'react-native'
import React from 'react'

export default function ModalBar() {
  return (
    <View style={styles.wrapper}>
        <View style={styles.bar}></View>
    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    bar: {
        borderRadius: 50,
        width: "25%",
        height: 10,
        backgroundColor: "rgba(255, 255, 255, 0.19)"
    }
});