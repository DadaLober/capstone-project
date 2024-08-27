'use client';

import NavLinks from '@/app/dashboard/(components)/nav-links';
import axios from 'axios';

const SideNav = () => {
    const handleLogout = async () => {
        try {
            const response = await axios.get('/api/logout');
            console.log(response.data);
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2 border border-e-red-100 ">
            <div className="mb-2 flex h-20 items-end justify-start rounded-md bg-green-600 p-4 md:h-40">
                {/* <Logo /> or some shit */}
            </div>
            <div className="flex grow flex-col space-y-2">
                <NavLinks />
                <div className="h-auto w-full grow rounded-md bg-gray-50 block"></div>
                <form>
                    <button onClick={handleLogout} className="flex w-full grow items-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-green-100 hover:text-green-600 flex-none justify-start p-2 px-3">
                        <div>Sign Out</div>
                    </button>
                </form>
            </div>
        </div >
    );
};

export default SideNav;
