import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import WorkoutButton from "@/components/WorkoutButton";
import { mainStyles } from "@/styles/Styles";
import { View } from "react-native";

export default function Workouts() {
  return (
    <View style={mainStyles.wrapper}>

      <Header title={'Workouts'} subtext={'Week 3'} bolt editURL={'/edit-workouts'} />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          <WorkoutButton />
          <WorkoutButton />
          <WorkoutButton />
          <WorkoutButton />
        </View>

        <LargeButton text="Add Workout" url={{pathname: "/edit-workouts"}} />
      </View>

    </View>
  );
}