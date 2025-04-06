import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import WorkoutButton from "@/components/WorkoutButton";
import { type IDList } from "@/Interfaces/dataTypes";
import { mainStyles } from "@/styles/Styles";
import { getWorkouts } from "@/utilities/db-functions";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function Workouts() {

  const db = useSQLiteContext();

  const [workouts, setWorkouts] = useState<IDList[] | undefined>();

  useEffect(() => {
    getWorkouts(db)
      .then((res) => {
        if (res) {
          setWorkouts(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeaderHeight = (height: number) => setHeaderHeight(height);  

  return (
    <>
      <Header headerHeight={headerHeight} updateHeaderHeight={updateHeaderHeight}
        title={'Workouts'} subtext={'Week 3'} bolt editURL={'/edit-workouts'} />

      <ScrollView showsVerticalScrollIndicator={false} 
        contentContainerStyle={[mainStyles.wrapper, {paddingTop: headerHeight}]}>

          <View style={mainStyles.buttonsList}>
            {workouts?.map((w) =>
              <WorkoutButton key={w.id} id={w.id} />
            )}
          </View>
          <LargeButton text="Add Workout" url={{ pathname: "/edit-workouts" }} />

      </ScrollView>

    </>
  );
}