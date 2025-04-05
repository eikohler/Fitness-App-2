import ExerciseButton from "@/components/ExerciseButton";
import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import { type IDList, type SingleWorkout } from "@/Interfaces/dataTypes";
import { mainStyles } from "@/styles/Styles";
import { getSingleWorkout, getWorkoutExercises } from "@/utilities/db-functions";
import { parseDate } from "@/utilities/helpers";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function SingleWorkout() {

  const urlParams = useLocalSearchParams() as { id: string };

  const db = useSQLiteContext();

  const [data, setData] = useState<SingleWorkout | undefined>();
  const [workoutExercises, setWorkoutExercises] = useState<IDList[] | undefined>();

  useEffect(() => {
    getSingleWorkout(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch((err) => console.log(err));

    getWorkoutExercises(db, parseInt(urlParams.id))
      .then((res) => {
        if (res) {
          setWorkoutExercises(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const [headerHeight, setHeaderHeight] = useState(0);
  const updateHeaderHeight = (height: number) => setHeaderHeight(height);

  if (!data) return "";

  return (
    <>
      <Header headerHeight={headerHeight} updateHeaderHeight={updateHeaderHeight}
        title={data.title} subtext={`${parseDate(data.date)} / ${data.exCount} EXERCISES`} backBtn
        editURL={{ pathname: "/workout/edit/[id]", params: { id: urlParams.id } }} />
        
      <ScrollView contentContainerStyle={[mainStyles.wrapper, { paddingTop: headerHeight }]}
        showsVerticalScrollIndicator={false}>

        <View style={mainStyles.buttonsDivider}>
          <View style={mainStyles.buttonsList}>
            {workoutExercises?.map((wex) =>
              <ExerciseButton key={wex.id} id={wex.id} />
            )}
          </View>
          <LargeButton text="Edit Workout" url={{ pathname: "/workout/edit/[id]", params: { id: 1 } }} />
        </View>

      </ScrollView>

    </>
  );
}