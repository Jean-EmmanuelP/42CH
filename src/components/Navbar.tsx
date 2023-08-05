"use client";

import calendarIcon from "../utils/images/calendarIcon.svg";
import Link from "next/link";
import { api } from "~/utils/api";
import axios from "axios";
import { useEffect, useState } from "react";

function extractUsername(email: string) {
  return email.split(" ")[0];
}

export default function Navbar() {
  const [infoUser, setInfoUser] = useState<any>({})
  
  useEffect(() => {
    userInfo()
  }, [])

  async function userInfo() {
    const username = sessionStorage.getItem("username");
    const request = await axios.post(
      process.env.NEXT_PUBLIC_API_URL+"/user/get_user_infos",
      JSON.stringify({ username: username }),
      { headers: { "Content-Type": "application/json" } }
    );
    if (request.data.success) {
      console.log(request.data)
      setInfoUser(request.data.user);
    }
  }
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
          src={infoUser.image}
          alt="Profile"
          className="h-12 w-12 rounded-full shadow-md"
        />
      </a>
    </div>
  );
}
