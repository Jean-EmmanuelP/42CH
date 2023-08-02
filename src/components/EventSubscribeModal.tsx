import axios from "axios";
import { useEffect, useState } from "react";
import { ReactNode } from "react";

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
}

export default function EventSubscribeModal({eventToSend}: EventSubscribeModalProps) {
  useEffect(() => {
    console.log("eventToSend is", eventToSend);
  },);


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
 const EventDate = new Date(eventToSend.day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric'});
  return (
    <div className="h-[50vh] w-full border border-black">
      <div className={`border border-black w-full h-[50%] text-white flex flex-col ${eventToSend.label}`}>
        <h1 className="h-[25%] w-full border border-black text-center pt-2 uppercase">{eventToSend.title}</h1>
        <h1 className="h-[75%] w-full border border-black">{EventDate}</h1>
      </div>
      <div className="border border-black h-[25%]">event description</div>
      <div className="border border-black h-[25%]">
        <button
          onClick={async () => {
            const request = await axios.post(
              "http://localhost:3333/events/add-user-to-event/",
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
          }}
        >
          Join
        </button>
        <button
          onClick={async () => {
            const request = await axios.post(
              "http://localhost:3333/events/remove-user-from-event/",
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
          }}
        >
          Leave
        </button>
      </div>
    </div>
  );
}
