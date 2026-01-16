import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_ITEMS as INITIAL_MENU } from '../data/mockData';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const CanteenContext = createContext();

export const useCanteen = () => useContext(CanteenContext);

export const CanteenProvider = ({ children }) => {
    // --- Global State ---
    const [menuItems, setMenuItems] = useState(INITIAL_MENU);
    const [orders, setOrders] = useState([]);
    const [isBookingPaused, setIsBookingPaused] = useState(false);
    const [pollItems, setPollItems] = useState([
        { name: 'Ghee Roast', votes: 120 },
        { name: 'Aloo Paratha', votes: 85 },
        { name: 'Chilly Chicken', votes: 102 }
    ]);

    // --- Firestore Real-Time Sync ---
    useEffect(() => {
        // 1. Sync Orders
        const orderQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubOrders = onSnapshot(orderQuery, (snapshot) => {
            const freshOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (freshOrders.length > 0) setOrders(freshOrders);
        }, (err) => console.log("Firestore connection failed (using mock):", err));

        // 2. Sync Menu (Optional: You can create a 'menu' collection in Firebase to make it dynamic)
        // For now, we keep menu local-first to ensure icons/images work easily without storage setup

        // 3. Sync Settings (Booking Paused Status)
        const settingsRef = doc(db, 'settings', 'config');
        const unsubSettings = onSnapshot(settingsRef, (doc) => {
            if (doc.exists()) {
                setIsBookingPaused(doc.data().isBookingPaused);
            }
        }, (err) => console.log("Using local settings"));

        return () => {
            unsubOrders();
            unsubSettings();
        };
    }, []);

    // --- Actions ---

    // Voting Logic (Mock for now, can move to DB)
    const voteItem = (itemName) => {
        setPollItems(prev => prev.map(item =>
            item.name === itemName ? { ...item, votes: item.votes + 1 } : item
        ));
    };

    // Order Logic (Push to Firebase)
    const placeOrder = async (newOrder) => {
        // Optimistic UI Update
        setOrders(prev => [newOrder, ...prev]);

        try {
            await addDoc(collection(db, 'orders'), {
                ...newOrder,
                createdAt: new Date().toISOString() // Firestore prefers strings/timestamps
            });
        } catch (e) {
            console.error("Error placing order to DB:", e);
        }
    };

    const markOrderServed = async (orderId) => {
        // Optimistic UI
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: 'Served', servedAt: new Date() } : o
        ));

        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status: 'Served', servedAt: new Date().toISOString() });
        } catch (e) {
            // If ID is fake (mock data), this will fail silently in demo
            console.warn("Could not update real DB (might be mock order)");
        }
    };

    // Menu Management
    const addMenuItem = (item) => {
        setMenuItems(prev => [...prev, { ...item, id: Date.now() }]);
    };

    const deleteMenuItem = (id) => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
    };

    // Poll Management
    const addPollItem = (name) => {
        setPollItems(prev => [...prev, { name, votes: 0 }]);
    };

    // Settings Management
    const toggleBookingStatus = async (status) => {
        setIsBookingPaused(status);
        try {
            // Attempt to save to cloud
            const settingsRef = doc(db, 'settings', 'config');
            await updateDoc(settingsRef, { isBookingPaused: status }); // Will fail if doc doesn't exist, create manually in console
        } catch (e) {
            console.warn("Settings not saved to DB");
        }
    };

    // --- Real-Time Crowd Analytics Logic ---
    const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
    const servingRatePerMinute = 3;

    const estimatedWaitTime = Math.ceil(pendingOrdersCount / servingRatePerMinute);

    let crowdLevel = 'Low';
    let crowdColor = 'text-green-500';

    if (pendingOrdersCount > 30) {
        crowdLevel = 'High';
        crowdColor = 'text-red-500';
    } else if (pendingOrdersCount > 10) {
        crowdLevel = 'Medium';
        crowdColor = 'text-yellow-500';
    }

    // Derived Analytics for Admin
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;

    return (
        <CanteenContext.Provider value={{
            menuItems, addMenuItem, deleteMenuItem,
            orders, placeOrder, markOrderServed,
            isBookingPaused, setIsBookingPaused: toggleBookingStatus,
            pollItems, voteItem, addPollItem,
            analytics: {
                pendingOrdersCount,
                estimatedWaitTime,
                crowdLevel,
                crowdColor,
                totalRevenue,
                totalOrders
            }
        }}>
            {children}
        </CanteenContext.Provider>
    );
};
