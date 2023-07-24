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
    <div className="flex h-20 w-full items-center justify-between bg-gray-100/20 shadow-md">
      <Link href="/" className="p-5">
        42Bets
      </Link>

      <div className="flex">
        <Link href="/classement" className="button mr-7 p-5">
          Classement
        </Link>
        <Link href="/calendrier" className="button p-5">
          Calendrier
        </Link>
        <Link href={`api/auth/${sessionUrl}`} className="button p-5">
          {session ? "Logout" : "Login"}
        </Link>
      </div>

      <a className="mr-10 flex items-center space-x-3 p-4 hover:text-blue-700">
        <div className="flex flex-col">
          <span className="py-1">{username}</span>
          <span className="py-1">Wallet : {UsernameData && UsernameData.balance}</span>
        </div>
        <img
          src={`${session?.user.image}`}
          alt="Profile"
          className="h-12 w-12 rounded-full"
        />
      </a>
    </div>
  );
}
