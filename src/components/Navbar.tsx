"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";

function extractUsername(email: string) {
  return email.split(" ")[0];
}

export default function Navbar() {
  const { data: session } = useSession();
  const sessionUrl = session ? "signout" : "signin";
  const username = session?.user?.name
    ? extractUsername(session.user.name)
    : null;

  const {
    data: UsernameData,
    error: UserError,
    isLoading: UserIsLoading,
  } = api.defi.getUserDataByName.useQuery({
    name: session?.user?.name || "",
  });

  return (
    <div className="flex h-full w-full items-center justify-between bg-[#272A30] text-white">
      <div>
        <Link href="/" className="p-5 text-xl">
          42Ch
        </Link>
        <p className="pl-12 text-xs">Become the best challenger of 42</p>
      </div>

      <div className="flex">
        <Link href="/classement" className="button mr-7 p-5">
          Classement
        </Link>
      </div>

      <a className="mr-10 flex items-center space-x-3 p-4 hover:text-blue-700">
        <img
          src={`${session?.user.image}`}
          alt="Profile"
          className="h-12 w-12 rounded-full shadow-md"
        />
      </a>
      {/* jai retire mais remets si ten as besoin c'est pour le rendu final */}
      <div className="bg-white text-gray-950">
        <Link href="/calendrier" className="button p-5">
          Calendrier
        </Link>
        <Link href={`api/auth/${sessionUrl}`} className="button p-5">
          {session ? "Logout" : "Login"}
        </Link>
      </div>
    </div>
  );
}
