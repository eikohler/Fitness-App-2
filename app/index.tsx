import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import WorkoutButton from "@/components/WorkoutButton";
import { type IDList } from "@/Interfaces/dataTypes";
import { mainStyles } from "@/styles/Styles";
import { getWorkouts } from "@/utilities/db-functions";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Workouts() {

  const db = useSQLiteContext();

  const [workouts, setWorkouts] = useState<IDList[] | undefined>();

  useEffect(() => {
    getWorkouts(db)
      .then((res) => { 
        if (res){
          setWorkouts(res);
        } 
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={mainStyles.wrapper}>

      <Header title={'Workouts'} subtext={'Week 3'} bolt editURL={'/edit-workouts'} />

      <View style={mainStyles.buttonsDivider}>
        <View style={mainStyles.buttonsList}>
          {workouts?.map((w)=>
            <WorkoutButton key={w.id} id={w.id} />
          )}
        </View>

        <LargeButton text="Add Workout" url={{pathname: "/edit-workouts"}} />
      </View>

    </View>
  );
}