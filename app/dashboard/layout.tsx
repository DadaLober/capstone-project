import SideNav from '@/app/dashboard/(components)/sidenav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <div className="flex-grow flex flex-row">
                <SideNav />
                <div className="flex-1 ml-3">
                    {children}
                </div>
            </div>
        </div>
    );
}