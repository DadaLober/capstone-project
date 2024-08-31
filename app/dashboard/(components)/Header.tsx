'use client';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

const Header: React.FC = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    return (
        <header className="bg-white pb-4">
            <div className=" flex items-center">
                {/* Logo or Brand */}
                {/* <div className=''> 
                <h1 className=''>Logo</h1>
            </div> */}

                {/* Search Bar */}
                <div className="flex-1 mx-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                {/* Profile Settings */}
                <div className="relative">
                    <button
                        onClick={toggleProfileMenu}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <div className='rounded-full border p-2'>
                            <FaUser size={24} className='' />
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700">
                            Username
                        </span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute z-20 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                            <button
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => alert('Logging out')}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
