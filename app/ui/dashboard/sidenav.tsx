import NavLinks from '@/app/ui/dashboard/nav-links';

export default function SideNav() {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <div className="mb-2 flex h-20 items-end justify-start rounded-md bg-green-600 p-4 md:h-40">
                {/* <Logo /> or some shit */}
            </div>
            <div className="flex grow flex-col space-y-2">
                <NavLinks />
                <div className="h-auto w-full grow rounded-md bg-gray-50 block"></div>
                <form>
                    <button className="flex w-full grow items-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-green-100 hover:text-green-600 flex-none justify-start p-2 px-3">
                        <div>Sign Out</div>
                    </button>
                </form>
            </div>
        </div >
    );
}
