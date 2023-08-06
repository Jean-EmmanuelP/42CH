"use client";

import FightImage from "../utils/images/fightImg.png";
import { useState, useEffect } from "react";
import Image from "next/image";

interface UserProfileProps {
  username: string;
  image: string;
  statusMessage: string;
  balance: number;
}

interface UserProfileReceived {
  userProfile: UserProfileProps;
  onClose: () => void;
}

export default function DefiModal({
  userProfile,
}: UserProfileReceived) {
  const handleDefiSubmit = async (e: any) => {
    e.preventDefault();
  };
  return (
    <div className="flex h-[65vh] w-full flex-col items-center justify-center bg-[#EEF0F3]">
      <div className="h[40%] flex w-full flex-col items-center justify-center border border-black">
        <Image
          src={FightImage}
          width={100}
          height={100}
          alt="challenge Image"
          className=""
        />
        <p className="w-full bg-gray-400/20 p-5 text-center font-bold">
          Envoie ton invitation de defi a ce challenger !
        </p>
      </div>
      <div className="h-[60%] w-full border border-black">
        <div className="h-[40%] flex justify-center">
        <Image
          src={userProfile.image}
          width={100}
          height={100}
          alt="UserProfile Image"
          className="rounded-full shadow-md pt-2"
        />
        </div>
        <form
          onSubmit={handleDefiSubmit}
          className="flex w-full h-[60%] relative flex-col items-center gap-2 border border-red-500"
        >
          <p className="text-gray mr-2 text-[10px] font-medium text-[#909090] pt-2">
            Envoie le defi a ce challenger, recupere un maximum de ses coins pour accroitre ta fortune
          </p>
          <button
            type="submit"
            className="absolute bottom-5 rounded-md border border-white bg-red-600 px-4 py-2 text-white shadow-md"
          >
            Envoyer le defi a {userProfile.username}
          </button>
        </form>
      </div>
    </div>
  );
}
