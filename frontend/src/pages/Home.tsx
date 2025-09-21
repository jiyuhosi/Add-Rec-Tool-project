import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="h-screen flex items-center justify-center gap-10">
            <Link
                to="/register/company"
                className="text-2xl font-bold  bg-white rounded-lg p-8 text-center border-2"
            >
                企業管理登録画面
            </Link>
        </div>
    );
};

export default HomePage;
