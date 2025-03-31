import { Workout } from '@/Interfaces/dataTypes';
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
                id INTEGER PRIMARY KEY,
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
                FOREIGN KEY (exercise_id) REFERENCES exercises (id)
                FOREIGN KEY (alt_exercise_id) REFERENCES exercises (id)
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
                FOREIGN KEY (exercise_id) REFERENCES exercises (id),
                UNIQUE(exercise_id, sets, reps)
            );
      `)
        console.log("DB Initialized");
    } catch (err) {
        console.log("Error while initializing DB: ", err);
    }
}


export const getWorkouts = async (db: SQLiteDatabase) : Promise<Workout[] | undefined> => {
    try {
        return await db.getAllAsync('SELECT id FROM workouts');
    } catch (err) {
        console.log("Error while loading workouts: ", err);
    }
}

export const getSingleWorkout = async (db: SQLiteDatabase, id: number) : Promise<Workout | null | undefined> => {
    try {
        return await db.getFirstAsync(`SELECT * FROM workouts where id = ${id}`);
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

// export const deleteWorkout = async (db: SQLiteDatabase, id: string) => {
//     try {
//         const query = await db.prepareAsync(`DELETE FROM workouts where workout_id = ?`);
//         await query.executeAsync(id);
//     } catch (err) {
//         console.log(`Error while deleting workout_id = ${id}: `, err);
//     }
// }

// export const getExercises = async (db: SQLiteDatabase) : Promise<Exercise[] | undefined> => {
//     try {
//         return await db.getAllAsync('SELECT * FROM exercises');
//     } catch (err) {
//         console.log("Error while loading exercises: ", err);
//     }
// }

// export const addExercise = async (db: SQLiteDatabase, newExercise: { title: string; ex_description: string; }) => {
//     try {
//         const query = await db.prepareAsync(`INSERT INTO exercises (title, ex_description) VALUES (?, ?)`);
//         await query.executeAsync(newExercise.title, newExercise.ex_description);
//     } catch (err) {
//         console.log("Error while adding exercise: ", err);
//     }
// }

// export const deleteExercise = async (db: SQLiteDatabase, id: string) => {
//     try {
//         const query = await db.prepareAsync(`DELETE FROM exercises where exercise_id = ?`);
//         await query.executeAsync(id);
//     } catch (err) {
//         console.log(`Error while deleting exercise_id = ${id}: `, err);
//     }
// }