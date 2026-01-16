import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary selection:text-black relative overflow-hidden">
            {/* Background gradients */}
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <main className="relative z-10 max-w-md mx-auto min-h-screen sm:max-w-xl md:max-w-4xl lg:max-w-6xl p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;
