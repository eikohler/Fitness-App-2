export interface IDList {
    id: number;
}
export interface SingleWorkout {
    title: string;
    date: Date;
    note: string;
    exCount: number;
}
export interface SingleWorkoutExercise {
    id: number;
    title: string;
    note: string;
    set_count: number;
    rep_count: number;
}
export interface SetRow {
    date: Date;
    weight: number;
    rir: number;
    note: string;
}

export interface Workout {
    id: number;
    title: string;
    exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
    exercise: Exercise;
    altExercise?: Exercise | null;
    setCount: number;
    repCount: number;
    isAltActive: boolean;
}

export interface Exercise {
    id: number;
    title: string;
    note: string | null;
}

export interface WorkoutExerciseRow {
    workout_id: number;
    workout_title: string;
    exercise_id: number | null;
    exercise_title: string | null;
    exercise_note: string | null;
    set_count: number | null;
    rep_count: number | null;
    is_alt_active: number | null;
    alt_exercise_id: number | null;
    alt_exercise_title: string | null;
    alt_exercise_note: string | null;
}

export interface ExerciseData {
    id: string;
    title: string;
    sets: number;
    reps: number;
    notes?: string;
}

export interface ModalExercise {
    title: string,
    notes: string,
    sets: number,
    reps: number
}