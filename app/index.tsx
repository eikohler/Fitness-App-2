import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import WorkoutButton from "@/components/WorkoutButton";
import { type IDList } from "@/Interfaces/dataTypes";
import { wrapperPaddingHorizontal, wrapperPaddingTop } from "@/styles/Styles";
import { getWorkouts } from "@/utilities/db-functions";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function StartScreen() {

    // const db = useSQLiteContext();

    // const [workouts, setWorkouts] = useState<IDList[] | undefined>();

    // useEffect(() => {
    //     getWorkouts(db)
    //         .then((res) => {
    //             if (res) {
    //                 setWorkouts(res);
    //             }
    //         })
    //         .catch((err) => console.log(err));
    // }, []);

    // const [headerHeight, setHeaderHeight] = useState(0);

    // const updateHeaderHeight = (height: number) => setHeaderHeight(height);

    return (<>
        <Header
            title={'Workouts'}
            showWeek btnText="EDIT"
            btnAction={() => { router.push({ pathname: "/edit-workouts" }) }}
        />
        {/* <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.wrapper}>
                <View style={mainStyles.buttonsList}>
                    {workouts?.map((w) =>
                        <WorkoutButton key={w.id} id={w.id} />
                    )}
                </View>
            </View>
        </ScrollView> */}
        <View style={styles.buttonWrapper}>
            <LargeButton text="Add Workout" action={() => router.push({ pathname: "/edit-workouts" })} />
        </View>
    </>);
}

const styles = StyleSheet.create({
    buttonWrapper: {
        paddingHorizontal: wrapperPaddingHorizontal,
        flex: 1,
        display: "flex",
        justifyContent: "center"
    },
    wrapper: {
        paddingTop: wrapperPaddingTop,
        paddingHorizontal: wrapperPaddingHorizontal
    }
});