import SideNav from '@/app/ui/dashboard/sidenav';

export const experimental_ppr = true;
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-row">
            <div className="w-screen flex-none md:w-64">
                <SideNav />
            </div>
            <div>{children}</div>
        </div>
    );
}