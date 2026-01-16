import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, QrCode, Utensils, AlertTriangle, CheckCircle, Clock, Plus, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';

const AdminDashboard = () => {
    const {
        menuItems, addMenuItem, deleteMenuItem,
        orders, markOrderServed,
        isBookingPaused, setIsBookingPaused,
        addPollItem,
        analytics
    } = useCanteen();

    const [activeTab, setActiveTab] = useState('orders'); // orders, menu, analytics
    const [showScanner, setShowScanner] = useState(false);
    const [scannerResult, setScannerResult] = useState("");

    // New Menu Item Form State
    const [newItemHtml, setNewItemHtml] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("Main Course");

    const [pollName, setPollName] = useState("");

    const handleAddMenu = () => {
        addMenuItem({
            name: newItemName,
            price: parseInt(newItemPrice),
            category: newItemCategory,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000",
            rating: 5.0,
            isSpecial: false
        });
        setNewItemHtml(false);
        setNewItemName("");
        setNewItemPrice("");
    };

    const handleSimulateScan = () => {
        // simulate scanning the first pending order
        const pending = orders.find(o => o.status === 'Pending');
        if (pending) {
            markOrderServed(pending.id);
            setScannerResult(`Success! Order ${pending.id} Served.`);
            setTimeout(() => setShowScanner(false), 1500);
        } else {
            setScannerResult("No pending orders to scan.");
        }
    };

    return (
        <div className="space-y-6 pt-6 pb-20">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent">Admin Panel</h1>
                    <p className="text-gray-400 text-sm">Canteen Management</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${!isBookingPaused ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    <span className={`h-2 w-2 rounded-full ${!isBookingPaused ? 'bg-green-500' : 'bg-red-500'}`} />
                    {!isBookingPaused ? 'Booking Active' : 'Booking Paused'}
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-white/10">
                {['orders', 'menu', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 capitalize ${activeTab === tab ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
                <>
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Pending Orders</p>
                            <p className="text-2xl font-bold text-white mt-1">{analytics.pendingOrdersCount}</p>
                            <p className="text-xs text-orange-400 mt-1">High Load</p>
                        </div>
                        <div className="glass-card p-4">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Revenue Today</p>
                            <p className="text-2xl font-bold text-white mt-1">₹ {analytics.totalRevenue}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-4">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setIsBookingPaused(!isBookingPaused)} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col items-center gap-2 transition-colors">
                                <Clock size={20} className={!isBookingPaused ? "text-green-400" : "text-red-400"} />
                                <span className="text-xs text-gray-300">{!isBookingPaused ? 'Pause Booking' : 'Resume Booking'}</span>
                            </button>
                            <button onClick={() => setShowScanner(true)} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col items-center gap-2 transition-colors">
                                <QrCode size={20} className="text-primary" />
                                <span className="text-xs text-gray-300">Scan Ticket</span>
                            </button>
                        </div>
                    </div>

                    {/* Live Orders Feed */}
                    <div>
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="text-lg font-bold text-white">Live Queue</h3>
                            <span className="text-xs text-gray-400">Updating live...</span>
                        </div>

                        <div className="space-y-3">
                            {orders.length === 0 && <p className="text-gray-500 text-center py-4">No orders yet.</p>}
                            {orders.map((order) => (
                                <motion.div
                                    layout
                                    key={order.id}
                                    className="glass-card p-4 flex justify-between items-center border-l-4 border-l-primary"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white">{order.id}</h4>
                                            <span className="text-xs bg-white/10 px-2 rounded text-gray-300">{order.slot}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{order.items.map(i => i.name).join(", ")}</p>
                                        <p className="text-xs text-gray-500">{order.user}</p>
                                    </div>

                                    {order.status === 'Pending' ? (
                                        <button onClick={() => markOrderServed(order.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                                            <CheckCircle size={20} />
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-500 font-medium">Served</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* --- MENU TAB --- */}
            {activeTab === 'menu' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-white">Current Menu</h3>
                        <button onClick={() => setNewItemHtml(!newItemHtml)} className="p-2 bg-primary rounded-lg text-black"><Plus size={18} /></button>
                    </div>

                    <AnimatePresence>
                        {newItemHtml && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="glass-card p-4 overflow-hidden">
                                <h4 className="font-bold mb-3 text-white">Add New Item</h4>
                                <div className="space-y-3">
                                    <input placeholder="Item Name" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" />
                                    <input placeholder="Price" type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" />
                                    <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white">
                                        <option>Main Course</option>
                                        <option>Veg</option>
                                        <option>Starters</option>
                                        <option>Dessert</option>
                                    </select>
                                    <button onClick={handleAddMenu} className="w-full bg-green-500 text-black font-bold py-2 rounded">Add Item</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-3">
                        {menuItems.map(item => (
                            <div key={item.id} className="glass-card p-3 flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <img src={item.image} className="h-10 w-10 rounded bg-gray-800 object-cover" />
                                    <div>
                                        <p className="font-bold text-white">{item.name}</p>
                                        <p className="text-xs text-gray-400">₹ {item.price}</p>
                                    </div>
                                </div>
                                <button onClick={() => deleteMenuItem(item.id)} className="text-red-400 p-2"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <h3 className="font-bold text-white mb-2">Next Day Poll</h3>
                        <div className="flex gap-2">
                            <input value={pollName} onChange={e => setPollName(e.target.value)} placeholder="Poll Item Name" className="flex-1 bg-black/20 border border-white/10 rounded p-2 text-white" />
                            <button onClick={() => { addPollItem(pollName); setPollName("") }} className="bg-secondary p-2 rounded text-white">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ANALYTICS TAB --- */}
            {activeTab === 'analytics' && (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="text-green-400" />
                            <h3 className="font-bold text-white">Sales Overview</h3>
                        </div>
                        <div className="h-32 flex items-end justify-between px-2 gap-2">
                            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                <div key={i} className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <h3 className="font-bold text-white mb-3">Peak Time Slots</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>12:15 - 12:30</span>
                                <span className="text-primary">85% Full</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-4 border border-orange-500/20">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="text-orange-500" />
                            <h3 className="font-bold text-white">Wastage Alert</h3>
                        </div>
                        <p className="text-sm text-gray-400">Yesterday we wasted 5kg of Rice. Recommended to reduce rice production by 10% today.</p>
                    </div>
                </div>
            )}

            {/* Mock Scanner Modal */}
            <AnimatePresence>
                {showScanner && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
                        <div className="w-64 h-64 border-2 border-primary rounded-xl relative flex items-center justify-center overflow-hidden">
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_#00E0FF]"
                            />
                            <p className="text-white/50 text-sm">Align QR Code</p>
                        </div>
                        <p className="text-white mt-4 font-bold">{scannerResult || "Scanning..."}</p>

                        <div className="flex gap-4 mt-8">
                            <button onClick={handleSimulateScan} className="px-6 py-2 bg-green-500 rounded-lg text-black font-bold">Simulate Detection</button>
                            <button onClick={() => setShowScanner(false)} className="px-6 py-2 bg-white/10 rounded-lg text-white">Cancel</button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;
