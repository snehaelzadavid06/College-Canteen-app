import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Implement Firebase Auth
        navigate('/student');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 w-full max-w-md text-center"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        PrePlate
                    </h1>
                    <p className="text-gray-400">Smart Ordering System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label className="text-sm font-medium text-gray-300 ml-1">Student Email</label>
                        <input
                            type="email"
                            placeholder="id@university.edu"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all mt-6"
                    >
                        Sign In with ID
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-gray-500 bg-card">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Google
                    </button>

                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="text-xs text-gray-500 hover:text-white transition-colors"
                        >
                            Are you a staff member? Login here
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
