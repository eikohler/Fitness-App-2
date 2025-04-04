-- CREATE TABLE workouts (
--     id INTEGER PRIMARY KEY,
--     title VARCHAR(100) NOT NULL UNIQUE,
--     date DATETIME DEFAULT CURRENT_TIMESTAMP,
--     note VARCHAR(100),
--     is_deload INTEGER DEFAULT 0,
--     is_deload_active INTEGER DEFAULT 0
-- );

-- CREATE TABLE exercises (
--     id INTEGER PRIMARY KEY,
--     title VARCHAR(100) NOT NULL UNIQUE,
--     note VARCHAR(100)
-- );

-- CREATE TABLE deload_workouts (
--     original_workout_id INTEGER,
--     deload_workout_id INTEGER,    
--     FOREIGN KEY (original_workout_id) REFERENCES workouts (id),
--     FOREIGN KEY (deload_workout_id) REFERENCES workouts (id)
-- );

-- CREATE TABLE workout_exercises (
--     workout_id INTEGER,
--     exercise_id INTEGER,
--     alt_exercise_id INTEGER,
--     set_count INTEGER NOT NULL,
--     rep_count INTEGER NOT NULL,
--     is_alt_active INTEGER DEFAULT 0,
--     FOREIGN KEY (workout_id) REFERENCES workouts (id),
--     FOREIGN KEY (exercise_id) REFERENCES exercises (id)
--     FOREIGN KEY (alt_exercise_id) REFERENCES exercises (id)
-- );

-- CREATE TABLE set_reps (
--     exercise_id INTEGER,
--     set INTEGER NOT NULL,
--     reps INTEGER NOT NULL,
--     weight FLOAT NOT NULL,
--     rir INTEGER NOT NULL,
--     date DATETIME DEFAULT CURRENT_TIMESTAMP,
--     note VARCHAR(100),
--     FOREIGN KEY (exercise_id) REFERENCES exercises (id),
--     UNIQUE(exercise_id, sets, reps)
-- );


-- INSERT INTO workouts (title) VALUES ('Push');

-- INSERT INTO exercises (title, note) VALUES ('Bench Press', 'Hold bar with wider than shoulder width grip. Control weight down to just below chest. Push back up through chest.');
-- INSERT INTO exercises (title, note) VALUES ('Shoulder Press', 'Hold bar with wider than shoulder width grip. Push weight up.');

-- INSERT INTO workout_exercises (workout_id, exercise_id, set_count, rep_count) VALUES (1, 1, 4, 8);
-- INSERT INTO workout_exercises (workout_id, exercise_id, set_count, rep_count) VALUES (1, 2, 3, 10);

-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 2, 10, 65, 2);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 3, 10, 70, 1);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 4, 10, 80, -1);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir, note) VALUES (2, 1, 10, 30, 4, 'Too light');
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (2, 2, 10, 40, 1);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (2, 3, 10, 35, 1);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (2, 4, 10, 30, 1);


-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir, note) VALUES (1, 1, 8, 30, 4, 'Too light');
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 2, 8, 40, 1);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 3, 8, 35, 1);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 4, 8, 30, 1);


-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 1, 8, 50, 2);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir, note) VALUES (1, 2, 8, 70, -1, "Too Heavy");
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 3, 8, 40, -1);
-- INSERT INTO set_reps (exercise_id, sets, reps, weight, rir) VALUES (1, 4, 8, 35, 1);