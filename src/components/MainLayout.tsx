"use client";

import { usePathname } from "next/navigation";
import Navbar from "~/components/Navbar";
import DefiRightBar from "~/components/Defi";
import Social from "~/components/Social";
import { ReactNode, useEffect, useState } from "react";
import SignIn from "./SignIn";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = usePathname();
  let isNotDefiPage;
  let isAdminPage;
  let isTournoiPage;

  function checkIfNotDefi(pathname: string) {
    return !pathname.includes("/defi");
  }

  function checkIfAdmin(pathname: string) {
    return pathname.includes("/admin");
  }

  function checkIfTournoi(pathname: string) {
    return pathname.includes("/tournoi");
  }

  if (router !== null) {
    isNotDefiPage = checkIfNotDefi(router);
    isAdminPage = checkIfAdmin(router);
    isTournoiPage = checkIfTournoi(router);
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
  if (isTournoiPage) {
    return (
    <div className="h-screen w-screen bg-[#EEF0F3]">
      <div className="mb-[3vh] h-[10vh] w-full">
        <Navbar />
      </div>
      <div className="mx-[1vw] mb-[2vh] flex h-[85vh] w-[98vw]">
          <div className="hidden sm:block h-full w-[20vw]">
            <Social />
          </div>
        <div
          className={`mx-[2vw] h-full ${isNotDefiPage ? "sm:w-[80vw]" : "sm:mx-0 sm:w-[73vw]"
            } w-full`}
        >
          {children}
        </div>
        {/* <div className="hidden sm:block h-full w-[27vw] rounded-md">
          <DefiRightBar />
        </div> */}
      </div>
    </div>
    )
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
          className={`mx-[2vw] h-full ${isNotDefiPage ? "sm:w-[53vw]" : "sm:mx-0 sm:w-[73vw]"
            } w-full`}
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
