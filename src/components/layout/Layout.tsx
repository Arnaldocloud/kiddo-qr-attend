
import React from 'react';
import Navbar from '../common/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-kiddo-gray">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
