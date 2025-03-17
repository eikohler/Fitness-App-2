import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import PlusButton from "@/components/PlusButton";
import SetButton from "@/components/SetButton";
import { mainStyles } from "@/styles/Styles";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function SingleWorkout() {

  const urlParams = useLocalSearchParams() as {id: string};

  return (
    <View style={mainStyles.wrapper}>

      <Header title={'CHEST PRESS'} subtext={'4 SETS / 8 REPS'} backBtn 
      editURL={{pathname: "/exercise/edit/[id]", params: {id: 1}}}
      notes={`Hold bar with wider than shoulder width grip. Control weight down to just below chest. Push back up through chest.`} />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          <SetButton />
          <SetButton />
          <SetButton />
          <PlusButton />
        </View>

        <LargeButton text="Next Exercise" />
      </View>

    </View>
  );
}