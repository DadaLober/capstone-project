'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/dashboard' , icon:'' },
  { name: 'User Accounts', href: '/dashboard/user-accounts', },
  { name: 'Reserved', href: '/dashboard/reserved' },
  { name: 'Archived', href: '/dashboard/archived' },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-green-100 hover:text-green-600 justify-start p-2 px-3 md:flex-none',
              {
                'bg-green-100 text-green-600': pathname === link.href,
              },
            )}>
            <p className=" md:hidden">{link.name}</p>
            <p className="hidden lg:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
