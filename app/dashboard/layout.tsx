import SideNav from '@/app/dashboard/(components)/sidenav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-row">
            <div className=" border flex-none md:w-48 overflow-y-auto fixed top-0 h-full">
                <SideNav />
            </div>
            <div className="flex flex-grow ml-44">{children}</div>
        </div>
    );
}