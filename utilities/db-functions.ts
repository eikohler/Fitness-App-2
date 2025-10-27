import { type SingleWorkout, type IDList, type SingleWorkoutExercise, type SetRow, WorkoutExerciseRow, Workout, WorkoutExercise } from '@/Interfaces/dataTypes';
import { type SQLiteDatabase } from 'expo-sqlite';

export const initDB = async (db: SQLiteDatabase) => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS workouts (
                workout_id VARCHAR(100) PRIMARY KEY,
                title VARCHAR(100) NOT NULL UNIQUE,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                note VARCHAR(100)                
            );

            CREATE TABLE IF NOT EXISTS exercises (
                exercise_id VARCHAR(100) PRIMARY KEY,
                title VARCHAR(100) NOT NULL UNIQUE,
                note VARCHAR(100)
            );            

            CREATE TABLE IF NOT EXISTS workout_exercises (
                w_ex_id VARCHAR(100) PRIMARY KEY,
                workout_id VARCHAR(100),
                exercise_id VARCHAR(100),
                alt_w_ex_id VARCHAR(100),
                set_count INTEGER NOT NULL,
                rep_count INTEGER NOT NULL,
                note VARCHAR(100),
                is_alt INTEGER DEFAULT 0,
                FOREIGN KEY (workout_id) REFERENCES workouts (workout_id),
                FOREIGN KEY (exercise_id) REFERENCES exercises (exercise_id),
                FOREIGN KEY (alt_w_ex_id) REFERENCES workout_exercises (w_ex_id)                
            );

            CREATE TABLE IF NOT EXISTS set_weights (
                sw_id VARCHAR(100) PRIMARY KEY,
                exercise_id VARCHAR(100),
                set_count INTEGER NOT NULL,
                rep_count INTEGER NOT NULL,
                weight FLOAT NOT NULL,
                rir INTEGER NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                note VARCHAR(100),
                is_deload INTEGER DEFAULT 0,
                FOREIGN KEY (exercise_id) REFERENCES exercises (exercise_id)
            );
      `)
        console.log("DB Initialized");

        const allWorkouts = await db.getAllAsync(`
            SELECT * FROM workouts
        `);

        console.log(allWorkouts);
    } catch (err) {
        console.log("Error while initializing DB: ", err);
    }
}


export const getWorkouts = async (db: SQLiteDatabase): Promise<IDList[] | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT id FROM workouts
        `);
    } catch (err) {
        console.log("Error while loading workouts: ", err);
    }
}

export const getSingleWorkout = async (db: SQLiteDatabase, id: number): Promise<SingleWorkout | null | undefined> => {
    try {
        return await db.getFirstAsync(`
            SELECT workouts.title, workouts.date, workouts.note, COUNT(workout_exercises.id) as exCount 
            FROM workouts 
            LEFT JOIN workout_exercises on workouts.id = workout_exercises.workout_id 
            WHERE workouts.id = ${id};
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

export const addMultipleWorkouts = async (db: SQLiteDatabase, workouts: { id: number; title: string; note: string; }[]) => {
    workouts.forEach(async (workout: { id: number; title: string; note: string; }) => {
        try {
            const query = await db.prepareAsync(`
                INSERT OR REPLACE INTO workouts (id, title, note, date) 
                VALUES (?, ?, ?, 
                    (SELECT COALESCE(
                        (SELECT date FROM workouts WHERE id = ?),
                        CURRENT_TIMESTAMP
                    ))
                );
            `);
            await query.executeAsync(workout.id, workout.title, workout.note, workout.id);
        } catch (err) {
            console.log(`Error while adding workout with ID ${workout.id}:`, err);
        }
    });
}

export const deleteWorkout = async (db: SQLiteDatabase, id: number) => {
    try {
        const query = await db.prepareAsync(`DELETE FROM workouts where id = ?`);
        await query.executeAsync(id);
    } catch (err) {
        console.log(`Error while deleting workout with ID = ${id}: `, err);
    }
}

export const deleteMultipleWorkouts = async (db: SQLiteDatabase, workouts: IDList[]) => {
    workouts.forEach(async (workout: IDList) => {
        try {
            const query = await db.prepareAsync(`DELETE FROM workouts where id = ?`);
            await query.executeAsync(workout.id);
        } catch (err) {
            console.log(`Error while deleting workout with ID = ${workout.id}: `, err);
        }
    });
}

export const getWorkoutExercises = async (db: SQLiteDatabase, id: number): Promise<IDList[] | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT id From workout_exercises WHERE workout_id = ${id};
        `);
    } catch (err) {
        console.log(`Error while loading workout exercises from workout with ID = ${id}: `, err);
    }
}

export const getSingleWorkoutExercise = async (db: SQLiteDatabase, id: number): Promise<SingleWorkoutExercise | null | undefined> => {
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

export const getSets = async (db: SQLiteDatabase, id: number): Promise<SetRow[] | undefined> => {
    try {
        return await db.getAllAsync(`
            SELECT * From set_reps;
        `);
    } catch (err) {
        console.log(`Error while loading set row with ID = ${id}: `, err);
    }
}

export const getSetRow = async (db: SQLiteDatabase, id: number, sets: number, reps: number): Promise<SetRow[] | undefined> => {
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

export const getSingleSet = async (db: SQLiteDatabase, id: number, sets: number, reps: number): Promise<SetRow | null | undefined> => {
    try {
        return await db.getFirstAsync(`
            SELECT weight, rir, note, date
            From set_reps 
            WHERE exercise_id = ${id} and sets = ${sets} and reps = ${reps}            
            ORDER BY date DESC;
        `);
    } catch (err) {
        console.log(`Error while loading single set with Exercise ID = ${id}, set count = ${sets} and rep count = ${reps}: `, err);
    }
}


const groupWorkouts = (rows: WorkoutExerciseRow[]): Workout[] => {
    const workoutMap = new Map<number, Workout>();

    for (const row of rows) {
        if (!workoutMap.has(row.workout_id)) {
            workoutMap.set(row.workout_id, {
                id: row.workout_id,
                title: row.workout_title,
                exercises: [],
            });
        }

        // Only add exercises if exercise_id is not null (workouts may have no exercises)
        if (row.exercise_id !== null) {
            const workout = workoutMap.get(row.workout_id)!;

            const workoutExercise: WorkoutExercise = {
                exercise: {
                    id: row.exercise_id,
                    title: row.exercise_title!,
                    note: row.exercise_note,
                },
                altExercise: row.alt_exercise_id
                    ? {
                        id: row.alt_exercise_id,
                        title: row.alt_exercise_title!,
                        note: row.alt_exercise_note,
                    }
                    : null,
                setCount: row.set_count!,
                repCount: row.rep_count!,
                isAltActive: !!row.is_alt_active,
            };

            workout.exercises.push(workoutExercise);
        }
    }

    return Array.from(workoutMap.values());
}


export const getEditWorkoutsData = async (db: SQLiteDatabase): Promise<Workout[] | undefined> => {
    try {
        const query = await db.getAllAsync(`
            SELECT 
                w.id AS workout_id,
                w.title AS workout_title,
                e.id AS exercise_id,
                e.title AS exercise_title,
                e.note AS exercise_note,
                we.set_count,
                we.rep_count,
                we.is_alt_active,
                ae.id AS alt_exercise_id,
                ae.title AS alt_exercise_title,
                ae.note AS alt_exercise_note
            FROM 
                workouts w
            LEFT JOIN 
                workout_exercises we ON w.id = we.workout_id
            LEFT JOIN 
                exercises e ON we.exercise_id = e.id
            LEFT JOIN 
                exercises ae ON we.alt_exercise_id = ae.id
            ORDER BY 
                w.id, we.id;
        `) as WorkoutExerciseRow[];

        const formattedQuery = groupWorkouts(query);

        return formattedQuery;

    } catch (err) {
        console.log("Error while loading workouts: ", err);
    }
};