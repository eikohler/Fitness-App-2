export interface Exercise {
    id: string;
    title: string;
    sets: number;
    reps: number;
    notes?: string;
}

export interface Workout {
    id: string;
    title: string;
    exercises: Exercise[];
    note?: string;
    date?: string;
}

export type Exercises = Exercise[];
export type Workouts = Workout[];