import { type SingleWorkout, type IDList, type SingleWorkoutSingleExercise } from '@/Interfaces/dataTypes';
import { type SQLiteDatabase } from 'expo-sqlite';

export const initDB = async (db: SQLiteDatabase) => {
    try {
        await db.execAsync(`            

            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY,
                title VARCHAR(100) NOT NULL UNIQUE,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                note VARCHAR(100),
                is_deload INTEGER DEFAULT 0,
                is_deload_active INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS exercises (
                id INTEGER PRIMARY KEY,
                title VARCHAR(100) NOT NULL UNIQUE,
                note VARCHAR(100)
            );

            CREATE TABLE IF NOT EXISTS deload_workouts (
                original_workout_id INTEGER,
                deload_workout_id INTEGER,    
                FOREIGN KEY (original_workout_id) REFERENCES workouts (id),
                FOREIGN KEY (deload_workout_id) REFERENCES workouts (id)
            );

            CREATE TABLE IF NOT EXISTS workout_exercises (
                workout_id INTEGER,
                exercise_id INTEGER,
                alt_exercise_id INTEGER,
                set_count INTEGER NOT NULL,
                rep_count INTEGER NOT NULL,
                is_alt_active INTEGER DEFAULT 0,
                FOREIGN KEY (workout_id) REFERENCES workouts (id),
                FOREIGN KEY (exercise_id) REFERENCES exercises (id),
                FOREIGN KEY (alt_exercise_id) REFERENCES exercises (id),
                UNIQUE( workout_id, exercise_id)
            );

            CREATE TABLE IF NOT EXISTS set_reps (
                exercise_id INTEGER,
                sets INTEGER NOT NULL,
                reps INTEGER NOT NULL,
                weight FLOAT NOT NULL,
                rir INTEGER NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                note VARCHAR(100),
                FOREIGN KEY (exercise_id) REFERENCES exercises (id),
                UNIQUE(exercise_id, sets, reps)
            );
      `)
        console.log("DB Initialized");
    } catch (err) {
        console.log("Error while initializing DB: ", err);
    }
}


export const getWorkouts = async (db: SQLiteDatabase) : Promise<IDList[] | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT id FROM workouts
        `);
    } catch (err) {
        console.log("Error while loading workouts: ", err);
    }
}

export const getSingleWorkout = async (db: SQLiteDatabase, id: number) : Promise<SingleWorkout | null | undefined> => {
    try {
        return await db.getFirstAsync(`
            SELECT workouts.title, workouts.date, COUNT(*) as exCount 
            FROM workouts INNER JOIN workout_exercises on workouts.id = workout_exercises.workout_id 
            WHERE workouts.id = 1;
        `);
    } catch (err) {
        console.log(`Error while loading workout with ID = ${id}: `, err);
    }
}

export const addWorkout = async (db: SQLiteDatabase, workout: { title: string; note: string; }) => {
    try {
        const query = await db.prepareAsync(`INSERT INTO workouts (title, note) VALUES (?, ?)`);
        await query.executeAsync(workout.title, workout.note);
    } catch (err) {
        console.log("Error while adding workout: ", err);
    }
}

export const deleteWorkout = async (db: SQLiteDatabase, id: number) => {
    try {
        const query = await db.prepareAsync(`DELETE FROM workouts where id = ?`);
        await query.executeAsync(id);
    } catch (err) {
        console.log(`Error while deleting workout with ID = ${id}: `, err);
    }
}

export const getSingleWorkoutExercises = async (db: SQLiteDatabase, id: number) : Promise<IDList[] | null | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT exercises.id From workout_exercises 
            INNER JOIN exercises on exercises.id = workout_exercises.exercise_id 
            WHERE workout_id = ${id};
        `);
    } catch (err) {
        console.log(`Error while loading exercises from workout with ID = ${id}: `, err);
    }
}

export const getSingleWorkoutSingleExercise = async (db: SQLiteDatabase, wID: number, exID: number) : Promise<SingleWorkoutSingleExercise | null | undefined> => {
    try {
        return await db.getFirstAsync(`
            SELECT exercises.title, workout_exercises.set_count, workout_exercises.rep_count From workout_exercises 
            INNER JOIN exercises on exercises.id = workout_exercises.exercise_id 
            WHERE workout_id = ${wID} and exercise_id = ${exID};
        `);
    } catch (err) {
        console.log(`Error while loading exercise with ID = ${exID} from workout with ID = ${wID}: `, err);
    }
}

export const getExercises = async (db: SQLiteDatabase) : Promise<IDList[] | undefined> => {
    try {
        return await db.getAllAsync(`SELECT id FROM exercises`);
    } catch (err) {
        console.log("Error while loading exercises: ", err);
    }
}