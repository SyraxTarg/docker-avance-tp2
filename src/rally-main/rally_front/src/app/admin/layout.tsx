import { ReactNode } from 'react';
import SideMenu from './side_menu';

interface LayoutProps {
  children: ReactNode;
}

export default function SuperAdmin({ children }: LayoutProps) {
  return (
    <div className="sm:flex">
      <SideMenu />
      <div className="w-full sm:ml-10 p-4 pt-20 sm:pt-24 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}


