import ExerciseButton from "@/components/ExerciseButton";
import Header from "@/components/Header";
import { largeButton, mainStyles } from "@/styles/Styles";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SingleWorkout() {

  const urlParams = useLocalSearchParams() as {id: string};

  return (
    <View style={mainStyles.wrapper}>

      <Header title={'PUSH'} subtext={'FEB. 24 / 4 EXERCISES'} backBtn 
      editURL={{pathname: "/workout/edit/[id]", params: {id: 1}}} />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          <ExerciseButton />
          <ExerciseButton />
          <ExerciseButton />
          <ExerciseButton />
          <ExerciseButton />
          <ExerciseButton />
        </View>

        <View style={largeButton.wrapper}>
          <Text style={largeButton.text}>EDIT Workout</Text>
        </View>
      </View>

    </View>
  );
}