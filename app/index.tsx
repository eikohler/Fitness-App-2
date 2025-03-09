import Header from "@/components/Header";
import WorkoutButton from "@/components/WorkoutButton";
import { largeButton, mainStyles } from "@/styles/Styles";
import { StyleSheet, Text, View } from "react-native";

export default function Workouts() {
  return (
    <View style={mainStyles.wrapper}>

      <Header title={'Workouts'} subtext={'Week 3'} bolt={true} />

      <View style={styles.wrapper}>
        <View style={styles.buttonsList}>
          <WorkoutButton />
          <WorkoutButton />
          <WorkoutButton />
          <WorkoutButton />
        </View>

        <View style={largeButton.wrapper}>
          <Text style={largeButton.text}>Add Workout</Text>
        </View>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between"
  },
  buttonsList: {
    display: "flex",
    gap: 25
  }
});