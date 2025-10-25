import Header from "@/components/Header";
import LargeButton from "@/components/LargeButton";
import { colors, wrapperPaddingHorizontal, wrapperPaddingTop } from "@/styles/Styles";
import { getWorkouts } from "@/utilities/db-functions";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import TimesIcon from "@/assets/icons/times-icon.svg";
import ArrowIcon from "@/assets/icons/arrow-icon.svg";

interface Exercise {
    id: string;
    title: string;
    sets: number;
    reps: number;
    notes?: string;
}

interface Workout {
    id: string;
    title: string;
    date: string;
    exercises: Exercise[];
}

type Workouts = Workout[];

const initialWorkouts: Workouts = [
    {
        id: uuidv4(),
        title: "Upper Body",
        date: "JAN. 15",
        exercises: [
            { id: uuidv4(), title: 'Bench Press', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'Shoulder Press', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'DB Curls', sets: 3, reps: 10 }
        ]
    },
    {
        id: uuidv4(),
        title: "Leg Day",
        date: "FEB. 2",
        exercises: [
            { id: uuidv4(), title: 'Leg Press', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'Deadlifts', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'Leg Curls', sets: 3, reps: 10 }
        ]
    },
    {
        id: uuidv4(),
        title: "Calisthenics Day",
        date: "MAR. 21",
        exercises: [
            { id: uuidv4(), title: 'Leg Raises', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'Pullups', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'Pushups', sets: 3, reps: 10 }
        ]
    },
    {
        id: uuidv4(),
        title: "Back Day",
        date: "APR. 8",
        exercises: [
            { id: uuidv4(), title: 'Lat Pulldowns', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'Cable Rows', sets: 3, reps: 10 },
            { id: uuidv4(), title: 'Bent Over Rows', sets: 3, reps: 10 }
        ]
    }
];


export default function StartScreen() {

    // Fetch workouts from DB
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

    const [workouts, setWorkouts] = useState<Workouts>(initialWorkouts);
    // const [workouts, setWorkouts] = useState<Workouts>([]);

    const RenderExercise = ({ exercise }: { exercise: Exercise }) => {
        return (
            <View style={styles.exerciseWrapper}>
                <Text style={styles.exerciseText}>
                    {exercise.title}  {exercise.sets}<TimesIcon width={12} height={9} fill={colors.white} />{exercise.reps}
                </Text>
                <ArrowIcon width={18} height={18} fill={colors.white} />
            </View>
        );
    }

    const RenderWorkout = ({ workout }: { workout: Workout }) => {
        return (
            <View style={styles.workoutWrapper}>
                <View style={styles.workoutHeading}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    <Text style={[styles.workoutDate, { marginBottom: 3 }]}> / </Text>
                    <Text style={[styles.workoutDate, { marginBottom: 2 }]}>{workout.date}</Text>
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
            showWeek btnText="EDIT"
            btnAction={() => { router.push({ pathname: "/edit-workouts" }) }}
        />
        {workouts.length > 1 ? (
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
        gap: 8
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
        alignItems: "center"
    },
    exerciseText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 600
    }
});