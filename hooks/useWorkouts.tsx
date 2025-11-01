import { useEffect, useState, useCallback } from "react";
import type { SQLiteDatabase } from "expo-sqlite";
import { getWorkouts } from "@/utilities/dbFunctions"; // adjust path
import { Workouts } from "@/interfaces/allTypes";

export const useWorkouts = (db: SQLiteDatabase) => {
    const [workouts, setWorkouts] = useState<Workouts>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchWorkouts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWorkouts(db);
            setWorkouts(data);
        } catch (err) {
            console.error("Failed to load workouts:", err);
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    }, [db]);

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    return { workouts, loading, error, refresh: fetchWorkouts };
};
