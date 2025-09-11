import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between text-black">
                    <Link to="/">Home</Link>
                    <div className="flex space-x-6">
                        <Link to="/register/company">Company</Link>
                        <Link to="/register/member">Member</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
