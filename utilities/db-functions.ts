import { type SingleWorkout, type IDList, type SingleWorkoutExercise, type SetRow } from '@/Interfaces/dataTypes';
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
                id INTEGER PRIMARY KEY,
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
                id INTEGER PRIMARY KEY,
                exercise_id INTEGER,
                sets INTEGER NOT NULL,
                reps INTEGER NOT NULL,
                weight FLOAT NOT NULL,
                rir INTEGER NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                note VARCHAR(100),
                FOREIGN KEY (exercise_id) REFERENCES exercises (id)
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

export const getWorkoutExercises = async (db: SQLiteDatabase, id: number) : Promise<IDList[] | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT id From workout_exercises WHERE workout_id = ${id};
        `);
    } catch (err) {
        console.log(`Error while loading workout exercises from workout with ID = ${id}: `, err);
    }
}

export const getSingleWorkoutExercise = async (db: SQLiteDatabase, id: number) : Promise<SingleWorkoutExercise | null | undefined> => {
    try {
        return await db.getFirstAsync(`
            SELECT exercises.id, exercises.title, exercises.note, workout_exercises.set_count, workout_exercises.rep_count 
            From workout_exercises 
            INNER JOIN exercises on exercises.id = workout_exercises.exercise_id 
            WHERE workout_exercises.id = ${id};
        `);
    } catch (err) {
        console.log(`Error while loading workout exercises with ID = ${id}: `, err);
    }
}

export const getSets = async (db: SQLiteDatabase, id: number) : Promise<SetRow[] | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT * From set_reps;
        `);
    } catch (err) {
        console.log(`Error while loading set row with ID = ${id}: `, err);
    }
}

export const getSetRow = async (db: SQLiteDatabase, id: number, sets: number, reps: number) : Promise<SetRow[] | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT weight, rir, note, date
            From set_reps 
            WHERE exercise_id = ${id} and sets = ${sets} and reps = ${reps}            
            ORDER BY date DESC
            LIMIT 2;
        `);
    } catch (err) {
        console.log(`Error while loading set row with ID = ${id}: `, err);
    }
}

export const getSingleSet = async (db: SQLiteDatabase, id: number) : Promise<SetRow | null | undefined> => {
    try {
        return await db.getFirstAsync(`
            SELECT sets, weight, rir, note From set_reps WHERE id = ${id};
        `);
    } catch (err) {
        console.log(`Error while loading single set with ID = ${id}: `, err);
    }
}

export const getExercises = async (db: SQLiteDatabase) : Promise<IDList[] | undefined> => {
    try {
        return await db.getAllAsync(`SELECT id FROM exercises`);
    } catch (err) {
        console.log("Error while loading exercises: ", err);
    }
}