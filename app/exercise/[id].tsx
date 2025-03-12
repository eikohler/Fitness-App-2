import Header from "@/components/Header";
import PlusButton from "@/components/PlusButton";
import SetButton from "@/components/SetButton";
import { largeButton, mainStyles } from "@/styles/Styles";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SingleWorkout() {

  const urlParams = useLocalSearchParams() as {id: string};

  return (
    <View style={mainStyles.wrapper}>

      <Header title={'CHEST PRESS'} subtext={'4 SETS / 8 REPS'} backBtn={true} 
      notes={`Hold bar with wider than shoulder width grip. Control weight down to just below chest. Push back up through chest.`} />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          <SetButton />
          <SetButton />
          <SetButton />
          <PlusButton />
        </View>

        <View style={largeButton.wrapper}>
          <Text style={largeButton.text}>Next Exercise</Text>
        </View>
      </View>

    </View>
  );
}