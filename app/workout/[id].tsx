import ExerciseButton from "@/components/ExerciseButton";
import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import { type IDList, type SingleWorkout } from "@/Interfaces/dataTypes";
import { mainStyles } from "@/styles/Styles";
import { getSingleWorkout, getSingleWorkoutExercises } from "@/utilities/db-functions";
import { parseDate } from "@/utilities/helpers";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function SingleWorkout() {

  const urlParams = useLocalSearchParams() as { id: string };

  const db = useSQLiteContext();

  const [data, setData] = useState<SingleWorkout | undefined>();
  const [exercises, setExercises] = useState<IDList[] | undefined>();

  useEffect(() => {
    getSingleWorkout(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch((err) => console.log(err));

    getSingleWorkoutExercises(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setExercises(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (!data) return "";

  return (
    <View style={mainStyles.wrapper}>

      <Header title={data.title} subtext={`${parseDate(data.date)} / ${data.exCount} EXERCISES`} backBtn
        editURL={{ pathname: "/workout/edit/[id]", params: { id: urlParams.id } }} />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          {exercises?.map((ex)=>
            <ExerciseButton key={ex.id} wID={parseInt(urlParams.id)} exID={ex.id} />
          )}
        </View>

        <LargeButton text="Edit Workout" url={{ pathname: "/workout/edit/[id]", params: { id: 1 } }} />
      </View>

    </View>
  );
}