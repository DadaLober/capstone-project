import SideNav from '@/app/dashboard/(components)/sidenav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-row">
            <div className="w-screen border flex-none md:w-64 overflow-y-auto fixed top-0 h-full">
                <SideNav />
            </div>
            <div className="flex flex-grow ml-64">{children}</div>
        </div>
    );
}