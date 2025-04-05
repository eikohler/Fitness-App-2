export interface IDList{
    id: number;
}
export interface SingleWorkout{
    title: string;
    date: Date;
    note: string;
    exCount: number;
}
export interface SingleWorkoutExercise{
    id: number;
    title: string;
    note: string;
    set_count: number;
    rep_count: number;
}
export interface SetRow{
    date: Date;
    weight: number;
    rir: number;
    note: string;
}