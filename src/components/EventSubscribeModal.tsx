"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import CalendarIcon from "../utils/images/calendarIcon.svg";
import LocationIcon from "../utils/images/Location.svg";
import Image from "next/image";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

interface Event {
  title: string;
  description: string;
  label: string;
  day: number;
  id: number;
  participantsUsernames: string[];
  isFull: boolean;
}

interface EventSubscribeModalProps {
  eventToSend: Event;
  showModal: (show: boolean) => void;
}

export default function EventSubscribeModal({
  eventToSend,
  showModal,
}: EventSubscribeModalProps) {
  useEffect(() => {
    console.log("eventToSend is", eventToSend);
  });
  /*
        eventToSend
: 
day
: 
1691012311716
description
: 
"le tournoi de poker pour tout les debutants et amateurs de poker, que le meilleur challenger gagne!"
id
: 
"clku937ql0000vkv9p93ftdao"
isFull
: 
false
label
: 
"bg-red-600"
limitedSeats
: 
-1
participantsUsernames
: 
[]
title
: 
"Poker Place"  
  */
  const EventDate = new Date(eventToSend.day).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="h-[30vh] w-full">
      <div
        className={`flex h-[65%] w-full flex-col text-white ${eventToSend.label}`}
      >
        <h1 className="h-[25%] w-full pt-2 text-center uppercase text-white/70">
          {eventToSend.title}
        </h1>
        <div className="flex h-[75%] w-full flex-col items-center justify-center gap-4">
          <p className="h-[50%] w-full pt-4 text-center italic text-white/90">
            {eventToSend.description}
          </p>
          <div className="flex h-[50%] w-full items-center bg-red-700">
            <div className="flex w-[50%] items-center justify-center text-[15px]">
              <Image
                src={CalendarIcon}
                width={30}
                height={30}
                alt="calendar Icon"
                className=""
              />
              <h1 className="pl-2 text-center">Le {EventDate} a 16h</h1>
            </div>
            <div className="flex w-[50%] items-center justify-center text-[15px]">
              <Image
                src={LocationIcon}
                width={30}
                height={30}
                alt="calendar Icon"
                className=""
              />
              <h1 className="pl-2 text-center">Paul-f5</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[35%] w-full rounded-b-md">
        <div className="h-full w-[60%]"></div>
        <div className="flex h-full w-[40%] gap-2 p-2">
          <button
            onClick={async () => {
              const request = await axios.post(
                publicRuntimeConfig.NEXT_PUBLIC_API_URL+"/events/add-user-to-event/",
                JSON.stringify({
                  eventId: eventToSend.id,
                  user: sessionStorage.getItem("username"),
                }),
                { headers: { "Content-Type": "application/json" } }
              );
              if (request.data.success == true) {
                console.log("success");
              } else {
                console.error(request.data.error);
              }
              showModal(false);
            }}
            className={`shadow-md ${eventToSend.label} w-[50%] rounded-md text-white`}
          >
            S'inscrire
          </button>
          <button
            onClick={async () => {
              const request = await axios.post(
                publicRuntimeConfig.NEXT_PUBLIC_API_URL+"/events/remove-user-from-event/",
                JSON.stringify({
                  eventId: eventToSend.id,
                  user: sessionStorage.getItem("username"),
                }),
                { headers: { "Content-Type": "application/json" } }
              );
              if (request.data.success == true) {
                console.log("success");
              } else {
                console.error(request.data.error);
              }
              showModal(false);
            }}
            className="w-[50%] rounded-md bg-gray-500 text-white/70 shadow-md"
          >
            Se desinscrire
          </button>
        </div>
      </div>
    </div>
  );
}
