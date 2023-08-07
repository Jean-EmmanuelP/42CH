"use client";

import calendarIcon from "../utils/images/calendarIcon.svg";
import Link from "next/link";
import { api } from "~/utils/api";
import axios from "axios";
import { useEffect, useState } from "react";
import getConfig from 'next/config';
import Image from "next/image";
import Modal from "./Modal";
import EventProfileModal from "./EventProfileModal";
const { publicRuntimeConfig } = getConfig();

function extractUsername(email: string) {
  return email.split(" ")[0];
}

export default function Navbar() {
  const [infoUser, setInfoUser] = useState<any>({})
  const [UserisHere, setUserIsHere] = useState(0);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [eventToSend, setEventToSend] = useState<{ image: string, username: string, balance: number, statusMessage: string, classment: string }>({ image: "", username: "", balance: 0, statusMessage: "", classment: "" });
  
  useEffect(() => {
    userInfo()
  }, [])

 
  useEffect(() => {
    console.log(`User is here`, UserisHere)
  }, [UserisHere])

  async function userInfo() {
    const username = sessionStorage.getItem("username");
    if (username)
    {
      setUserIsHere(1);
    }
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

      <div className="flex items-center h-full gap-10">
        <Link href="/classement" className="button mr-7 p-5">
          Classement
        </Link>
        {/* <input 
          type="text"
          placeholder="Rechercher un challenger"
          className="shadow-lg rounded-lg h-[40%] px-2 py-4 placeholder:text-[12px] placeholder:text-center"
        /> */}
      </div>

      <button className= "mr-10 flex items-center space-x-3 p-4 hover:text-blue-700" onClick={() => { setShowUserModal(true), setEventToSend(infoUser) }}>
        {UserisHere !== 0 && (<Image
          src={infoUser.image}
          width={50}
          height={50}
          alt="Profile"
          className="h-12 w-12 rounded-full shadow-md"
        />)}
        
      </button>
      <Modal isVisible={showUserModal} onClose={() => setShowUserModal(false)} width="w-[500px]">
        <EventProfileModal userProfile={eventToSend} />
      </Modal>
    </div>
  );
}
