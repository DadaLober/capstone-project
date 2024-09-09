'use client';
import { FaUser } from 'react-icons/fa';

const Header: React.FC = () => {
    return (
        <header className="bg-white flex items-center mt-3 justify-between">
            <div className="flex items-center">
                {/* Logo or Brand */}
                <div className="mr-4">
                    <h1 className="text-xl font-bold">PortMan</h1>
                </div>

                {/* Search Bar */}
                <div className="flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
            </div>

            {/* Profile Settings */}
            <div className="relative mr-4">
                <button
                    className="flex items-center space-x-2 focus:outline-none"
                >
                    <div className='rounded-full border p-2'>
                        <FaUser size={24} className="" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                        Username
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Header;
