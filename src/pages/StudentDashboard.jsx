import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Clock, Users, Plus, Minus, X, CheckCircle, AlertOctagon, User, LogOut, Edit2, Save } from 'lucide-react';
import { TIME_SLOTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useCanteen } from '../context/CanteenContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import QRCode from 'react-qr-code';
import AIChatbot from '../components/AIChatbot';
import VotingSection from '../components/VotingSection';

const StudentDashboard = () => {
    const { cart, addToCart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
    const { menuItems, placeOrder, isBookingPaused, analytics } = useCanteen();
    const navigate = useNavigate(); // Hook for navigation

    // Derived Analytics from Context
    const { crowdLevel, crowdColor, estimatedWaitTime } = analytics;

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [lastOrderQr, setLastOrderQr] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    // -- User Profile State --
    const [userProfile, setUserProfile] = useState({
        name: "John Doe",
        studentId: "#2024001",
        email: "john@uni.edu"
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState(userProfile);

    const categories = ["All", ...new Set(menuItems.map(item => item.category))];
    const filteredItems = selectedCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const handleCheckout = () => {
        if (!selectedSlot) {
            alert("Please select a time slot first!");
            return;
        }

        // Checkout Logic
        const newOrder = {
            id: `ORD-${Date.now().toString().slice(-4)}`,
            items: cart,
            totalAmount,
            slot: selectedSlot.time,
            status: 'Pending',
            user: userProfile.name, // Use dynamic name
            createdAt: new Date()
        };

        placeOrder(newOrder); // Add to Global Context
        setLastOrderQr(JSON.stringify({ orderId: newOrder.id }));
        clearCart();

        // Simulate Payment
        setTimeout(() => {
            setOrderPlaced(true);
            setShowCart(false);
        }, 1000);
    };

    const handleSaveProfile = () => {
        setUserProfile(editForm);
        setIsEditingProfile(false);
    };

    const handleLogout = () => {
        // Clear any auth tokens if we had them
        navigate('/');
    };

    if (orderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="bg-green-500/20 p-6 rounded-full"
                >
                    <CheckCircle size={64} className="text-green-500" />
                </motion.div>
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
                    <p className="text-gray-400">Your lunch is booked for {selectedSlot.time}</p>
                </div>

                <div className="bg-white p-4 rounded-xl">
                    <QRCode value={lastOrderQr} size={200} />
                </div>
                <p className="text-sm text-gray-500">Show this QR at the counter</p>

                <button onClick={() => setOrderPlaced(false)} className="text-primary underline mt-4">Place another order</button>
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-6 pb-24 relative">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">Hello, {userProfile.name.split(' ')[0]}</h1>
                    <p className="text-gray-400 text-sm">What are you craving today?</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowProfile(true)} className="h-10 w-10 glass-card flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <User size={20} />
                    </button>
                    <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
                        <div className="h-10 w-10 glass-card flex items-center justify-center text-primary transition-transform active:scale-95">
                            <ShoppingBag size={20} />
                        </div>
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
                                {cart.reduce((a, b) => a + b.quantity, 0)}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Smart Queue Display */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-4 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Crowd Level</p>
                        <Users size={16} className={crowdColor} />
                    </div>
                    <p className={`text-xl font-bold flex items-center gap-2 ${crowdColor}`}>
                        {crowdLevel}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-4 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Wait Time</p>
                        <Clock size={16} className="text-white" />
                    </div>
                    <p className="text-white text-xl font-bold">~{estimatedWaitTime} min</p>
                    <p className="text-[10px] text-gray-400">Serving ~3 students/min</p>
                </motion.div>
            </div>

            {/* Booking Paused Alert */}
            {isBookingPaused && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex gap-3 items-center"
                >
                    <AlertOctagon className="text-red-500 shrink-0" />
                    <div>
                        <h4 className="font-bold text-red-500">Booking Paused</h4>
                        <p className="text-xs text-red-300">The canteen is currently at maximum capacity. Please wait.</p>
                    </div>
                </motion.div>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary text-black' : 'bg-card text-gray-400 border border-white/5'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Voting Section */}
            <VotingSection />

            {/* Menu Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((item) => (
                    <motion.div
                        layout
                        key={item.id}
                        className="glass-card p-3 flex gap-4 items-center"
                    >
                        <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded-lg bg-gray-800" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-white leading-tight">{item.name}</h4>
                                <span className="text-primary font-bold">₹{item.price}</span>
                            </div>
                            <p className="text-gray-500 text-xs mt-1">{item.category} • ⭐ {item.rating}</p>

                            <button
                                onClick={() => addToCart(item)}
                                disabled={isBookingPaused}
                                className={`mt-3 text-xs px-3 py-2 rounded-lg transition-colors w-full ${isBookingPaused
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-white/10 hover:bg-white/20 text-primary'
                                    }`}
                            >
                                {isBookingPaused ? 'Unavailable' : 'Add to Cart'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Cart Modal */}
            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCart(false)}
                            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] rounded-t-3xl border-t border-white/10 p-6 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                                <button onClick={() => setShowCart(false)} className="bg-white/10 p-2 rounded-full"><X size={18} /></button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">Your cart is empty</div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-8">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                                <div className="flex gap-3 items-center">
                                                    <div className="h-10 w-10 rounded-lg bg-gray-700 overflow-hidden">
                                                        <img src={item.image} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-400">₹{item.price * item.quantity}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-white"><Minus size={14} /></button>
                                                    <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-white"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-300 mb-3">Select Pickup Slot</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {TIME_SLOTS.map(slot => (
                                                <button
                                                    key={slot.id}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    disabled={slot.booked >= slot.capacity}
                                                    className={`p-3 rounded-xl border text-left transition-all ${selectedSlot?.id === slot.id
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                                                        } ${slot.booked >= slot.capacity ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <p className="text-xs font-bold">{slot.time}</p>
                                                    <p className="text-[10px] opacity-70 mt-1">{slot.capacity - slot.booked} spots left</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4 mb-4">
                                        <div className="flex justify-between items-center text-lg font-bold text-white">
                                            <span>Total</span>
                                            <span>₹ {totalAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={isBookingPaused}
                                        className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all text-lg ${isBookingPaused
                                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02] active:scale-95 shadow-primary/20'
                                            }`}
                                    >
                                        {isBookingPaused ? 'Booking Paused' : 'Pay & Book Slot'}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Student Profile Modal */}
            <AnimatePresence>
                {showProfile && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowProfile(false)}
                            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            className="fixed top-0 bottom-0 right-0 z-50 bg-[#121212] w-3/4 max-w-sm border-l border-white/10 p-6 flex flex-col"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">My Account</h2>

                            <div className="bg-white/5 p-4 rounded-xl mb-6 relative group">
                                <div className="h-16 w-16 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg shadow-primary/20">
                                    {userProfile.name.charAt(0)}
                                </div>

                                {isEditingProfile ? (
                                    <div className="space-y-3 mt-2">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase tracking-wider">Name</label>
                                            <input
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase tracking-wider">Student ID</label>
                                            <input
                                                value={editForm.studentId}
                                                onChange={e => setEditForm({ ...editForm, studentId: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={handleSaveProfile} className="flex-1 bg-green-500/20 text-green-400 py-1 rounded text-xs font-bold flex items-center justify-center gap-1">
                                                <Save size={12} /> Save
                                            </button>
                                            <button onClick={() => { setIsEditingProfile(false); setEditForm(userProfile) }} className="flex-1 bg-white/10 text-white py-1 rounded text-xs">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { setIsEditingProfile(true); setEditForm(userProfile) }}
                                            className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <h3 className="font-bold text-white text-lg">{userProfile.name}</h3>
                                        <p className="text-gray-400 text-sm">{userProfile.studentId}</p>
                                        <p className="text-gray-500 text-xs mt-1">{userProfile.email}</p>
                                    </>
                                )}
                            </div>

                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Clock size={16} className="text-primary" /> Past Orders
                            </h3>

                            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                                <div className="glass-card p-3 border-l-2 border-green-500 bg-white/5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-white font-medium text-sm">Chicken Biriyani</span>
                                            <p className="text-gray-500 text-[10px] mt-0.5">Yesterday, 12:30 PM</p>
                                        </div>
                                        <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">Served</span>
                                    </div>
                                </div>
                                <div className="glass-card p-3 border-l-2 border-green-500 bg-white/5 opacity-60">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-white font-medium text-sm">Veg Fried Rice</span>
                                            <p className="text-gray-500 text-[10px] mt-0.5">14 Jan, 01:00 PM</p>
                                        </div>
                                        <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">Served</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button onClick={handleLogout} className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 flex items-center justify-center gap-2 transition-colors">
                                    <LogOut size={18} />
                                    Logout
                                </button>
                                <button onClick={() => setShowProfile(false)} className="w-full p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
                                    Close Menu
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AIChatbot />
        </div>
    );
};

export default StudentDashboard;
