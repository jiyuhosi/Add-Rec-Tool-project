import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/Home';
import CompanyPage from './pages/Company';
import { authService } from './services/authService';

const App: React.FC = () => {
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        authService.initialize()
            .then(() => {
                setIsAuthReady(true);
            })
            .catch((error) => {
                console.error('Authentication initialization failed:', error);
                setIsAuthReady(true);
            });
    }, []);

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>認証中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>
            <main className="container mx-auto px-4 py-8 pt-20">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register/company" element={<CompanyPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
