import SideNav from '@/app/dashboard/(components)/sidenav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-row">
            <div className="w-screen border flex-none md:w-52 overflow-y-auto fixed top-0 h-full">
                <SideNav />
            </div>
            <div className="flex flex-grow ml-52">{children}</div>
        </div>
    );
}