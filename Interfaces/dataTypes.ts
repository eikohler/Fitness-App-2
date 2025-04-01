export interface IDList{
    id: number;
}
export interface SingleWorkout{
    title: string;
    date: Date;
    exCount: number;
}
export interface SingleWorkoutSingleExercise{
    title: string;
    set_count: number;
    rep_count: number;
}