import { type SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from "uuid";
import { Exercises, Workouts } from '@/interfaces/allTypes';

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

        // clearDB(db);

        const workouts = await getWorkouts(db);

        console.log(workouts);
    } catch (err) {
        console.log("Error while initializing DB: ", err);
    }
}

export const getWorkouts = async (db: SQLiteDatabase): Promise<Workouts> => {
    try {
        // Fetch all workouts
        const workouts = await db.getAllAsync(`
      SELECT workout_id AS id, title, note, date
      FROM workouts
    `) as Workouts;

        const workoutsWithExercises: Workouts = [];

        for (const workout of workouts) {
            // Fetch exercises linked to this workout
            const exercises = await db.getAllAsync(`
        SELECT 
          e.exercise_id AS id,
          e.title AS title,
          we.set_count AS sets,
          we.rep_count AS reps,
          COALESCE(we.note, e.note) AS notes
        FROM workout_exercises we
        JOIN exercises e ON e.exercise_id = we.exercise_id
        WHERE we.workout_id = ?
      `, [workout.id]) as Exercises;

            // Push into formatted structure
            workoutsWithExercises.push({
                id: workout.id,
                title: workout.title,
                exercises: exercises.map(e => ({
                    id: e.id,
                    title: e.title,
                    sets: e.sets,
                    reps: e.reps,
                    notes: e.notes ?? undefined,
                })),
            });
        }

        return workoutsWithExercises;
    } catch (err) {
        console.error("Error while loading workouts: ", err);
        return [];
    }
};

export const saveWorkoutsToDB = async (db: SQLiteDatabase, workouts: Workouts) => {
    try {
        // Use a transaction for atomic operation
        await db.withTransactionAsync(async () => {
            // 0️⃣ Clear existing data first
            await db.runAsync(`DELETE FROM workout_exercises`);
            await db.runAsync(`DELETE FROM workouts`);
            // Note: You can keep exercises table if you want shared exercises, or also clear it
            // await db.runAsync(`DELETE FROM exercises`);

            // 1️⃣ Insert new workouts and their exercises
            for (const workout of workouts) {
                await db.runAsync(
                    `
          INSERT INTO workouts (workout_id, title, note)
          VALUES (?, ?, ?)
        `,
                    [workout.id, workout.title, null]
                );

                for (const exercise of workout.exercises) {
                    // Insert or ignore exercise to avoid duplicates
                    await db.runAsync(
                        `
            INSERT OR IGNORE INTO exercises (exercise_id, title, note)
            VALUES (?, ?, ?)
          `,
                        [exercise.id, exercise.title, exercise.notes ?? null]
                    );

                    // Insert workout_exercises link
                    await db.runAsync(
                        `
            INSERT INTO workout_exercises (
              w_ex_id, workout_id, exercise_id, set_count, rep_count, note
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `,
                        [
                            uuidv4(),
                            workout.id,
                            exercise.id,
                            exercise.sets,
                            exercise.reps,
                            exercise.notes ?? null,
                        ]
                    );
                }
            }
        });

        console.log("✅ Workouts successfully cleared and saved to database.");
    } catch (err) {
        console.error("❌ Error saving workouts to DB:", err);
    }
};

export const clearDB = async (db: SQLiteDatabase) => {
    try {
        // Use a transaction to ensure atomic delete
        await db.withTransactionAsync(async () => {
            // Delete all links first to avoid foreign key constraints
            await db.runAsync(`DELETE FROM workout_exercises`);
            await db.runAsync(`DELETE FROM exercises`);
            await db.runAsync(`DELETE FROM workouts`);
            await db.runAsync(`DELETE FROM set_weights`);
        });

        console.log("✅ All workouts, exercises, set weights and links deleted from database.");
    } catch (err) {
        console.error("❌ Error clearing database:", err);
    }
};