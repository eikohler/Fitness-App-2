import Header from "@/components/Header";
import WorkoutButton from "@/components/WorkoutButton";
import { mainStyles } from "@/styles/Styles";
import { StyleSheet, View } from "react-native";

export default function Workouts() {
  return (
    <View>
      <Header title={'Workouts'} subtext={'Week 3'} bolt={true} />

      <View style={[mainStyles.wrapper, styles.wrapper]}>
        <WorkoutButton />
        <WorkoutButton />
        <WorkoutButton />
        <WorkoutButton />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {        
    paddingTop: 40,
    display: "flex",
    gap: 25
  },
});