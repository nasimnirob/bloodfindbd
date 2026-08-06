import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bloodfind_recent_searches";
const MAX_ITEMS = 10;

export default function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState([]);

    // load once on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setRecentSearches(JSON.parse(stored));
        } catch (err) {
            console.error("Failed to read recent searches:", err);
        }
    }, []);

    const persist = (list) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (err) {
            console.error("Failed to save recent searches:", err);
        }
    };

    
    const addRecentSearch = useCallback((term) => {
        const trimmed = term?.trim();
        if (!trimmed) return;

        setRecentSearches((prev) => {
            const withoutDupe = prev.filter(
                (item) => item.name.toLowerCase() !== trimmed.toLowerCase()
            );
            const newItem = {
                id: `${Date.now()}`,
                type: "query",
                name: trimmed,
                timestamp: Date.now(),
            };
            const updated = [newItem, ...withoutDupe].slice(0, MAX_ITEMS);
            persist(updated);
            return updated;
        });
    }, []);

    const removeRecentSearch = useCallback((id) => {
        setRecentSearches((prev) => {
            const updated = prev.filter((item) => item.id !== id);
            persist(updated);
            return updated;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            console.error("Failed to clear recent searches:", err);
        }
    }, []);

    return { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches };
}