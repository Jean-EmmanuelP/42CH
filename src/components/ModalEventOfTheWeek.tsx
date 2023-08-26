"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import CalendarIcon from "../utils/images/calendarIcon.svg";
import LocationIcon from "../utils/images/Location.svg";
import Image from "next/image";
import React, {useRef} from 'react';
import { useMediaQuery } from "react-responsive";

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
  setWeekly?: () => void;
}

export default function ModalEventOfTheWeek({
  eventToSend,
  showModal,
  setWeekly
}: EventSubscribeModalProps) {
  const EventDate = new Date(eventToSend.day).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSetWeekly = async () => {
    if (setWeekly) {
      await setWeekly();
    }
  }
  const [partnerInput, setPartnerInput] = useState("");
  const partnerRef = useRef<HTMLInputElement | null>(null);
  const partner = partnerRef.current?.value;
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  if (isMobile) {
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
        <div className="flex h-full w-[60%] flex flex-col gap-1 items-center justify-center">
            <p className="text-sm">Qui est ton duo ?</p>
            <input type="text" ref={partnerRef} className={'flex border rounded-md text-center placeholder:text-[11px]'} placeholder="entre le login 42 | ex: jperrama" style={{borderColor: attemptedSubmit && !partnerRef.current?.value ?'red':'black'}}  value={partnerInput} onChange={e => setPartnerInput(e.target.value)} required />
        </div>
        <div className="flex h-full w-[40%] gap-2 p-2 justify-center">
          {eventToSend.participantsUsernames.includes(sessionStorage.getItem("username") as string) ?
            (<button
              onClick={async () => {
                const request = await axios.post(
                  process.env.NEXT_PUBLIC_API_URL + "/events/remove-user-from-event/",
                  JSON.stringify({
                    eventId: eventToSend.id,
                    user: sessionStorage.getItem("username"),
                    partner: partner
                  }),
                  { headers: { "Content-Type": "application/json" } }
                );
                if (request.data.success == true) {
                  // console.log("success");
                  ;
                } else {
                  console.error(request.data.error);
                }
                showModal(false);
                // window.location.reload();
                handleSetWeekly()
              }}
              className="w-full rounded-md bg-gray-500 text-white/70 shadow-md"
            >
              Se desinscrire
            </button>)
            :
            (<button
              onClick={async () => {
                if (!partnerRef.current?.value) {
                    setAttemptedSubmit(true);
                    console.log(attemptedSubmit);
                    return;
                }
                setAttemptedSubmit(false);
                const request = await axios.post(
                  process.env.NEXT_PUBLIC_API_URL + "/events/add-user-to-event/",
                  JSON.stringify({
                    eventId: eventToSend.id,
                    user: sessionStorage.getItem("username"),
                    // partner: partner
                  }),
                  { headers: { "Content-Type": "application/json" } }
                );
                const request_2 = await axios.post(
                    process.env.NEXT_PUBLIC_API_URL + "/events/add-user-to-event/",
                    JSON.stringify({
                      eventId: eventToSend.id,
                      user: partner,
                      // partner: partner
                    }),
                    { headers: { "Content-Type": "application/json" } }
                  );
                const request_3 = await axios.post(
                    process.env.NEXT_PUBLIC_API_URL + "/tourney/add_team/",
                    JSON.stringify({
                      tourneyTitle: eventToSend.title,
                      firstMember: sessionStorage.getItem("username"),
                      secondMember: partner
                    }),
                    { headers: { "Content-Type": "application/json" } }
                  );
                if (request.data.success == true && request_2.data.success && request_3.data.success) {
                  // console.log("success");
                  ;
                } else {
                  console.error(request.data.error);
                }
                showModal(false);
                // window.location.reload();
                handleSetWeekly()
              }}
            // disabled={!partnerInput}
              className={`shadow-md ${eventToSend.label} w-full rounded-md text-white`}
            >
              S'inscrire
            </button>)
          }
        </div>
      </div>
    </div>
    )
  }
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
        <div className="flex h-full w-[60%] flex flex-col gap-1 items-center justify-center">
            <p>Avec qui participes-tu au tournoi ?</p>
            <input type="text" ref={partnerRef} className={'border rounded-md px-5 text-center placeholder:text-[12px]'} placeholder="entre le login 42 | ex: jperrama" style={{borderColor: attemptedSubmit && !partnerRef.current?.value ?'red':'black', borderWidth: attemptedSubmit && !partnerRef.current?.value ? '4px' : '2px'}}  value={partnerInput} onChange={e => setPartnerInput(e.target.value)} required />
        </div>
        <div className="flex h-full w-[40%] gap-2 p-2 justify-end">
          {eventToSend.participantsUsernames.includes(sessionStorage.getItem("username") as string) ?
            (<button
              onClick={async () => {
                const request = await axios.post(
                  process.env.NEXT_PUBLIC_API_URL + "/events/remove-user-from-event/",
                  JSON.stringify({
                    eventId: eventToSend.id,
                    user: sessionStorage.getItem("username"),
                    partner: partner
                  }),
                  { headers: { "Content-Type": "application/json" } }
                );
                if (request.data.success == true) {
                  // console.log("success");
                  ;
                } else {
                  console.error(request.data.error);
                }
                showModal(false);
                // window.location.reload();
                handleSetWeekly()
              }}
              className="w-[50%] rounded-md bg-gray-500 text-white/70 shadow-md"
            >
              Se desinscrire
            </button>)
            :
            (<button
              onClick={async () => {
                if (!partnerRef.current?.value) {
                    setAttemptedSubmit(true);
                    console.log(attemptedSubmit);
                    return;
                }
                setAttemptedSubmit(false);
                const request = await axios.post(
                  process.env.NEXT_PUBLIC_API_URL + "/events/add-user-to-event/",
                  JSON.stringify({
                    eventId: eventToSend.id,
                    user: sessionStorage.getItem("username"),
                    partner: partner
                  }),
                  { headers: { "Content-Type": "application/json" } }
                );
                if (request.data.success == true) {
                  // console.log("success");
                  ;
                } else {
                  console.error(request.data.error);
                }
                showModal(false);
                // window.location.reload();
                handleSetWeekly()
              }}
            // disabled={!partnerInput}
              className={`shadow-md ${eventToSend.label} w-[50%] rounded-md text-white`}
            >
              S'inscrire
            </button>)
          }
        </div>
      </div>
    </div>
  );
}
