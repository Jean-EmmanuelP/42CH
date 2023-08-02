'use client'

import { usePathname } from "next/navigation";
import Navbar from "~/components/Navbar";
import DefiRightBar from "~/components/Defi";
import Social from "~/components/Social";
import {ReactNode} from 'react';

interface MainLayoutProps {
  children: ReactNode;
}


export default function MainLayout({ children }: MainLayoutProps) {
  const router = usePathname();
  let isNotDefiPage;

  function checkIfNotDefi(pathname: string) {
    return !pathname.includes("/defi");
  }
  if (router !== null) {
    isNotDefiPage = checkIfNotDefi(router)
  }

  return (
    <div className="h-screen w-screen bg-[#EEF0F3]">
      <div className="mb-[3vh] h-[10vh] w-full">
        <Navbar />
      </div>
      <div className="mx-[1vw] mb-[2vh] flex h-[85vh] w-[98vw]">
        {isNotDefiPage && (
          <div className="h-full w-[20vw]">
            <Social />
          </div>
        )}
        <div className={`mx-[2vw] h-full ${isNotDefiPage ? 'w-[53vw]': 'w-[73vw] mx-0'}`}>
          {children}
        </div>
        <div className="h-full w-[27vw] rounded-md">
          <DefiRightBar />
        </div>
      </div>
    </div>
  );
}
