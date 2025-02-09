"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from './db';

const ShortlistContext = createContext();

export function ShortlistProvider({ children }) {
    const [stageOneShortlist, setStageOneShortlist] = useState([]);
    const [finalShortlist, setFinalShortlist] = useState([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        async function loadShortlists() {
            try {
                const stageOneItems = await db.stageOne.toArray();
                const finalItems = await db.finalShortlist.toArray();

                setStageOneShortlist(stageOneItems.map(item => item.imageName));
                setFinalShortlist(finalItems.map(item => item.imageName));
            } catch (error) {
                console.error('Failed to load from IndexedDB:', error);
            } finally {
                setInitialized(true);
            }
        }
        loadShortlists();
    }, []);

    const addToStageOneShortlist = async (imgName) => {
        setStageOneShortlist(prev => [...prev, imgName]);
        try {
            await db.stageOne.put({ imageName: imgName });
        } catch (error) {
            console.error('Error adding to stageOne:', error);
        }
    };

    const removeFromStageOneShortlist = async (imgName) => {
        setStageOneShortlist((prev) => prev.filter((item) => item !== imgName));
        try {
            await db.stageOne.delete(imgName);
        } catch (error) {
            console.error('Error removing from stageOne:', error);
        }

        try {
            const existing = await db.finalShortlist.get(imgName);
            if (existing) {
                setFinalShortlist((prev) => prev.filter((item) => item !== imgName));
                await db.finalShortlist.delete(imgName);
            }
        } catch (error) {
            console.error('Error removing from finalShortlist during stageOne removal:', error);
        }
    };

    const addToFinalShortlist = async (imgName) => {
        setFinalShortlist(prev => [...prev, imgName]);
        try {
            await db.finalShortlist.put({ imageName: imgName });
        } catch (error) {
            console.error('Error adding to finalShortlist:', error);
        }
    };

    const removeFromFinalShortlist = async (imgName) => {
        setFinalShortlist(prev => prev.filter(item => item !== imgName));
        try {
            await db.finalShortlist.delete(imgName);
        } catch (error) {
            console.error('Error removing from finalShortlist:', error);
        }
    };

    const handleExport = async () => {
        try {
            const finalItems = await db.finalShortlist.toArray();
            const finalNames = finalItems.map((item) => item.imageName);

            const dataStr = JSON.stringify(finalNames, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'final-list.json';
            link.click();
        } catch (error) {
            console.error('Error exporting from finalShortlist:', error);
        }
    };

    const contextValue = {
        stageOneShortlist,
        finalShortlist,
        addToStageOneShortlist,
        removeFromStageOneShortlist,
        addToFinalShortlist,
        removeFromFinalShortlist,
        setFinalShortlist,
        handleExport
    };

    return (
        <ShortlistContext.Provider value={contextValue}>
            {initialized ? children : null}
        </ShortlistContext.Provider>
    );
}

export function useShortlist() {
    return useContext(ShortlistContext);
}
