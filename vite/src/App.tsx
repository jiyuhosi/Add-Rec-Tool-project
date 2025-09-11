import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/Home';
import CompanyPage from './pages/Company';
import MemberPage from './pages/Member';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>
            <main className="container mx-auto px-4 py-8 pt-20">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register/company" element={<CompanyPage />} />
                    <Route path="/register/member" element={<MemberPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
