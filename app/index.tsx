import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import { colors, wrapperPaddingHorizontal, wrapperPaddingTop } from "@/styles/Styles";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import 'react-native-get-random-values';
import TimesIcon from "@/assets/icons/times-icon.svg";
import ArrowIcon from "@/assets/icons/arrow-icon.svg";
import { Exercise, Workout } from "@/interfaces/allTypes";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useCallback } from "react";

export default function StartScreen() {

    const db = useSQLiteContext();
    const { workouts, refresh } = useWorkouts(db);

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const RenderExercise = ({ exercise }: { exercise: Exercise }) => {
        return (
            <View style={styles.exerciseWrapper}>
                <Text style={styles.exerciseText}>
                    {exercise.title}  {exercise.sets}<TimesIcon width={12} height={9} fill={colors.white} />{exercise.reps}
                </Text>
                <View style={styles.arrowWrapper}>
                    <ArrowIcon width={18} height={18} fill={colors.white} />
                </View>
            </View>
        );
    }

    const RenderWorkout = ({ workout }: { workout: Workout }) => {
        return (
            <View style={styles.workoutWrapper}>
                <View style={styles.workoutHeading}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    {workout.date && (<>
                        <Text style={[styles.workoutDate, { marginBottom: 3 }]}> / </Text>
                        <Text style={[styles.workoutDate, { marginBottom: 2 }]}>{workout.date}</Text>
                    </>)}
                </View>
                {workout.exercises.map((ex) => (
                    <RenderExercise exercise={ex} key={ex.id} />
                ))}
            </View>
        );
    }

    return (<>
        <Header
            title={'Workouts'}
            showWeek
            btnText="Edit"
            btnAction={() => { router.push({ pathname: "/edit-workouts" }) }}
        />
        {workouts.length ? (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    {workouts.map((w) => (
                        <RenderWorkout workout={w} key={w.id} />
                    ))}
                </View>
            </ScrollView>
        ) : (
            <View style={styles.buttonWrapper}>
                <LargeButton text="Add Workout" action={() => router.push({ pathname: "/edit-workouts" })} />
            </View>
        )}
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
        paddingHorizontal: wrapperPaddingHorizontal,
        display: "flex",
        gap: 30,
        marginBottom: 50
    },
    workoutWrapper: {
        display: "flex",
        gap: 10
    },
    workoutHeading: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end"
    },
    workoutTitle: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 700,
        marginRight: 3
    },
    workoutDate: {
        fontSize: 14,
        color: colors.white
    },
    exerciseWrapper: {
        backgroundColor: colors.darkBlue,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 12,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        height: 40
    },
    exerciseText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 600
    },
    arrowWrapper: {
        position: "absolute",
        right: 0,
        top: 0,
        paddingHorizontal: 12,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.darkerBlue,
        height: 40,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    }
});