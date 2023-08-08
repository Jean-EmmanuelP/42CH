"use client";

import { usePathname } from "next/navigation";
import Navbar from "~/components/Navbar";
import DefiRightBar from "~/components/Defi";
import Social from "~/components/Social";
import { ReactNode, useEffect, useState } from "react";
import { divide } from "lodash";
import SignIn from "./SignIn";

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
    isNotDefiPage = checkIfNotDefi(router);
  }

  const [isSession, setIsSession] = useState(false);
  
  useEffect(() => {
    setIsSession(sessionStorage.getItem("accessToken") !== null);
  }, []);

  if (!isSession) {
    return (
    <div className="h-screen w-screen bg-[#EEF0F3]">
      <div className="mb-[3vh] h-[10vh] w-full">
        <Navbar />
      </div>
      <div className="h-[90vh] w-full">
        <SignIn />
      </div>
    </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#EEF0F3]">
      <div className="mb-[3vh] h-[10vh] w-full">
        <Navbar />
      </div>
      <div className="mx-[1vw] mb-[2vh] flex h-[85vh] w-[98vw]">
        {isNotDefiPage && (
          <div className="hidden sm:block h-full w-[20vw]">
            <Social />
          </div>
        )}
        <div
          className={`mx-[2vw] h-full ${
            isNotDefiPage ? "w-[53vw]" : "mx-0 w-[73vw]"
          }`}
        >
          {children}
        </div>
        <div className="hidden sm:block h-full w-[27vw] rounded-md">
          <DefiRightBar />
        </div>
      </div>
    </div>
  );
}
