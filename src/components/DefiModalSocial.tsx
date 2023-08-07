"use client";

import FightImage from "../utils/images/fightImg.png";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Modal from "./Modal";
import { toast } from "react-toastify";

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
  onClose,
}: UserProfileReceived) {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const sendRequest = async (e) => {
    e.preventDefault();
    const request = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/create_request/",
      JSON.stringify({
        senderUsername: sessionStorage.getItem("username"),
        receiverUsername: userProfile.username,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("🚀 ~ file: DefiModalSocial.tsx:38 ~ sendRequest ~ request:", request)

    if (request.data.success === true) {
      setMessage("Défi envoyé avec succès!");
      setError(null);
      onClose();
    } else {
      const errorRequest = request.data.error;
      setError(`Erreur lors de l'envoi du défi : ${errorRequest}`);
      setMessage(null);
    }
  };

  return (
    <div className="relative flex h-[65vh] w-full flex-col items-center justify-center bg-[#EEF0F3]">
      <div className="h[40%] flex w-full flex-col items-center justify-center">
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
      <div className="relative h-[60%] w-full">
        <div className="flex h-[70%] justify-center">
          <Image
            src={userProfile.image}
            width={200}
            height={200}
            alt="UserProfile Image"
            className="rounded-full pt-2 shadow-md"
          />
        </div>
        <form className="relative flex h-[30%] w-full flex-col items-center gap-2">
          <p className="text-gray mr-2 pt-2 text-[10px] font-medium text-[#909090]">
            Envoie le defi a ce challenger, recupere un maximum de ses coins
            pour accroitre ta fortune
          </p>
          <button
            type="submit"
            className="absolute bottom-3 rounded-md border border-white bg-red-600 px-4 py-2 text-white shadow-md"
            onClick={sendRequest}
          >
            Envoyer le defi a {userProfile.username}
          </button>
        </form>
      </div>
      {message && <p className="absolute top-0 flex items-center bg-red-900 text-green-600">{message}</p>}
      {error && <p className="absolute top-0 text-red-600 bg-gray-900 p-1 rounded-md border border-red-500 flex items-center">{error}</p>}
    </div>
  );
}
