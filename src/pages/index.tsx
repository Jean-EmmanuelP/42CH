import { useContext, useEffect, useState } from "react";
import GlobalContext from "~/context/GlobalContext";
import Image from "next/image";
import Modal from "~/components/Modal";
import EventSubscribeModal from "~/components/EventSubscribeModal";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import PokerImage from "../utils/images/poker.svg";
import Position from "../utils/images/position.svg";
import ClockIcon from "../utils/images/clockicon.svg";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import axios from "axios";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { StringSupportOption } from "prettier";

interface Event {
  title: string;
  description: string;
  label: string;
  day: number;
  id: number;
  participantsUsernames: string[];
  isFull: boolean;
}

export default function HomePage() {
  // Context
  // const { weeklyEvents } = useContext(GlobalContext);
  const [weeklyEvents, setWeeklyEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [eventToSend, setEventToSend] = useState<Event>();

  // Hardcoded best and worst players
  const bestPlayers = [
    {
      name: "Dimitri",
      img: "https://www.didierdrogbafoundation.org/sites/default/files/didier-drogba.jpg",
      gain: "10000",
    },
    {
      name: "Oscar",
      img: "https://img.freepik.com/photos-gratuite/portrait-beau-jeune-homme-gros-plan_176420-15568.jpg",
      gain: "6500",
    },
    {
      name: "LeRusse",
      img: "https://www.superprof.fr/images/annonces/professeur-home-jeune-ingenieur-chinois-paris-capable-parler-francais-chinois-anglais.jpg",
      gain: "4800",
    },
  ];

  async function setWeekly() {
    const today = dayjs().startOf("day");
    const tenDaysFromNow = dayjs().add(10, "day");
    const request = await axios.get(
      "http://localhost:3333/events/incoming-events/"
    );
    request.data.forEach((element: Event) => {
      element.day = Number(element.day);
    });
    const events: Event[] = request.data.filter(
      (evt: Event) =>
        dayjs(evt.day).isSameOrAfter(today) &&
        dayjs(evt.day).isSameOrBefore(tenDaysFromNow)
    );
    if (events.length > 0) {
      // sort event by date
      events.sort((a, b) => {
        if (a.day > b.day) {
          return 1;
        }
        if (a.day < b.day) {
          return -1;
        }
        return 0;
      });
      setWeeklyEvents(events);
    }
  }

  useEffect(() => {
    setWeekly();
  }, []);

  function BiggestEvent() {
    console.log(`you clicked on the image`);
    /*
      -> Mettre le pop up pour s'inscrire au big event
    */
  }

  function getColorFromLabel(label: any) {
    const parts = label.split("-");
    return parts[1]; // cela renvoie "red" si label est "bg-red-500"
  }
  function getName(label: any) {
    const parts = label.split(" ");
    return parts[0];
  }

  {
    /*
  ex : async function setWeekly() {
      const today = dayjs().startOf("day");
      const tenDaysFromNow = dayjs().add(10, "day");
      const request = await axios.get(
        "http://localhost:3333/events/incoming-events/"
      );
      request.data.forEach((element: Event) => {
        element.day = Number(element.day);
      });
      const events: Event[] = request.data.filter(
        (evt: Event) =>
          dayjs(evt.day).isSameOrAfter(today) &&
          dayjs(evt.day).isSameOrBefore(tenDaysFromNow)
      );
  */
  }
  interface PlayerProps {
    username: string;
    image: string;
    balance: number;
  }
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  async function BestPlayersOfTheWeek() {
    const request = await axios.get(
      "http://localhost:3333/user/get_top_users/"
    );
    const topUsers = request.data.topUsers;
    console.log(topUsers);
    setPlayers(topUsers);
    return topUsers;
  }

  function truncateWords(sentence = "bonjour", maxWords = 15) {
    let words = sentence.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    } else {
      return sentence;
    }
  }

  useEffect(() => {
    (async () => {
      await BestPlayersOfTheWeek();
    })();
  }, []);
  // Render
  return (
    <div className="flex h-full w-full flex-col">
      <button className="flex h-2/5 w-full items-center justify-center overflow-hidden rounded-[15px] shadow-md">
        <Image
          src={PokerImage}
          alt="Event of the Week"
          className="w-full object-center"
        />
      </button>
      <div className="mt-2 flex h-3/5 w-full rounded-md">
        <div className="flex w-[56%] flex-col rounded-md ">
          <div className="mb-[2%] h-[56%] w-full rounded-md bg-white">
            <h2 className="mb-2 pl-7 pt-4 font-bold">Evenements</h2>
            <div className="flex-grow overflow-auto rounded-b-md bg-white px-2">
              <div className="max-h-32">
                {weeklyEvents.map((event: Event, index: number) => (
                  // Première chose, if event.isFull == true event marqué comme full + quand on click dessus on peut pas s'inscrire
                  // Deuxième chose si sessionStorage.getItem('username') est dans event.participantsUsernames marqué event comme inscrit
                  // et quand on click dessus on peut se désinscrire
                  // Sinon juste afficher l'event et quand on click dessus on peut s'inscrire

                  <div
                    key={index}
                    className={`mb-2 flex h-12 w-full rounded-md border bg-white hover:cursor-pointer`}
                    style={{ borderColor: getColorFromLabel(event.label) }}
                    onClick={() => {
                      setEventToSend(event);
                      setShowModal(true);
                    }}
                  >
                    <div
                      className={`w-1/3 ${event.label} rounded-l-md text-center text-sm text-white`}
                    >
                      <p>{new Date(event.day).getDate()}</p>
                      <p>
                        {new Date(event.day).toLocaleString("default", {
                          month: "long",
                        })}
                      </p>
                    </div>
                    <div className="flex h-full w-2/3 flex-row pl-1">
                      <div className="h-full w-2/3">
                        <h3
                          className="h-1/3 text-sm text-black"
                          style={{ color: getColorFromLabel(event.label) }}
                        >
                          {event.title}
                        </h3>
                        <p className="flex h-1/3 items-center overflow-hidden pl-2 text-[9px] text-gray-500">
                          {truncateWords(event.description, 6)}
                        </p>
                        <div className="flex h-1/3 w-full flex-row items-center">
                          <div className="flex w-1/2 justify-center">
                            <Image
                              src={ClockIcon}
                              alt="clockicon"
                              height={10}
                              width={10}
                            />
                            <p className="pl-1 text-[8px]">16h</p>
                          </div>
                          <div className="flex w-1/2 justify-center">
                            <Image
                              src={Position}
                              alt="position"
                              height={10}
                              width={10}
                            />
                            <p className="text-[8px]">Paul F5</p>
                          </div>
                        </div>
                      </div>
                      <div className="h-full w-1/3">
                        {!event.isFull ? (
                          <div className="flex flex-col  pl-1 pt-1 text-center text-[10px] text-green-500">
                            {event.participantsUsernames.includes(
                              sessionStorage.getItem("username") as string
                            ) ? (
                              <p>Inscrit</p>
                            ) : (
                              <p>S'inscrire</p>
                            )}
                            {/* ici il faut relier le back pour mettre l'heure et l'endroit et il faut le mettre ici */}
                            <div className="rounded-tl-md pt-2 text-black"></div>
                          </div>
                        ) : (
                          <div className="flex px-1 pt-1 text-center text-xs text-green-500">
                            Full
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-[42%] w-full">
            <div className="flex h-full w-full flex-col rounded-l-md bg-white pl-7">
              <h2 className="mb-2 font-bold">Joueurs de la semaine</h2>
              <div className="mb-2 flex h-full flex-wrap overflow-hidden">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex h-full w-[32%] w-full flex-col items-center justify-center"
                  >
                    <div className={index === 1 ? "shadow-xl" : "shadow-sm"}>
                      <img
                        className="h-full w-full object-contain"
                        src={`${player.image}`}
                        alt="Image Player"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-2 flex w-[44%] flex-row bg-white shadow-md">
          <div className="border-b border-black">
            <h1 className="pl-7 pt-4 font-bold">Live Pari</h1>
          </div>
        </div>
      </div>
      {eventToSend != undefined ? (
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <EventSubscribeModal eventToSend={eventToSend} />
        </Modal>
      ) : null}
    </div>
  );
}
