"use client";

import { useSession } from 'next-auth/react';
import Link from "next/link";

function extractUsername(email: string) {
  return email.split(" ")[0];
}

export default function Navbar() {
  const { data: session } = useSession();
  const sessionUrl = session ? "signout" : "signin";
  const username = session?.user?.name
    ? extractUsername(session.user.name)
    : null;

  return (
    <div className="bg-gray-100/20 shadow-md flex justify-between items-center w-full h-20">
      <Link href="/" className="font-mono p-5">
        42Bets
      </Link>

      <div className="flex">
        <Link href="/classement" className="button font-mono p-5 mr-7">
          Classement
        </Link>
        <Link href="/calendrier" className="button font-mono p-5">
          Calendrier
        </Link>
        <Link href={`api/auth/${sessionUrl}`} className="button font-mono p-5">
          {session ? "Logout" : "Login"}
        </Link>
      </div>

      <a className="flex items-center mr-10 p-4 hover:text-blue-700 space-x-3">
        <span className="font-mono py-1">{username}</span>
        <img
          src={`${session?.user.image}`}
          alt="Profile"
          className="h-12 w-12 rounded-full"
        />
      </a>
    </div>
  );
}
