import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import PlusButton from "@/components/PlusButton";
import SetButton from "@/components/SetButton";
import { SingleWorkoutExercise } from "@/Interfaces/dataTypes";
import { mainStyles } from "@/styles/Styles";
import { getSets, getSingleWorkoutExercise } from "@/utilities/db-functions";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function SingleWorkout() {

  const urlParams = useLocalSearchParams() as { id: string };

  const db = useSQLiteContext();

  const [data, setData] = useState<SingleWorkoutExercise | undefined>();

  useEffect(() => {
    getSingleWorkoutExercise(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch((err) => console.log(err));      
  }, []);

  // useEffect(() => {
  //   if(data){
  //     getSets(db, data.id)
  //       .then((res) => {
  //         if (res) {
  //           console.log(res);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [data]);

  if (!data) return "";

  return (
    <View style={mainStyles.wrapper}>

      <Header title={data.title} subtext={`${data.set_count} SETS / ${data.rep_count} REPS`} backBtn
        editURL={{ pathname: "/exercise/edit/[id]", params: { id: 1 } }}
        notes={data.note} />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          {Array.from({ length: data.set_count }).map((x, i) =>
            <SetButton key={i + 1} exID={data.id} sets={i + 1} reps={data.rep_count} />
          )}
          <PlusButton />
        </View>

        <LargeButton text="Next Exercise" url={{ pathname: "/exercise/edit/[id]", params: { id: 1 } }} />
      </View>

    </View>
  );
}