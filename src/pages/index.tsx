import { useContext, useEffect, useState } from "react";
import GlobalContext from "~/context/GlobalContext";
import Image from "next/image";
import Modal from "~/components/Modal";
import EventSubscribeModal from "~/components/EventSubscribeModal";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import PokerImage from "../utils/images/poker.svg";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import axios from "axios";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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
      <div className="mt-2 flex h-3/5 w-full">
        <div className="flex w-[56%] flex-col border border-black">
          <div className="h-[58%] w-full border-b border-black">
          <h2 className="rounded-t-md bg-white pl-7 pt-4">Evenements</h2>
          <div className="mb-2 ml-4 mr-4 flex-grow overflow-auto rounded-b-md bg-white pr-2">
            <div className="max-h-32">
              {weeklyEvents.map((event: Event, index: number) => (
                // Première chose, if event.isFull == true event marqué comme full + quand on click dessus on peut pas s'inscrire
                // Deuxième chose si sessionStorage.getItem('username') est dans event.participantsUsernames marqué event comme inscrit
                // et quand on click dessus on peut se désinscrire
                // Sinon juste afficher l'event et quand on click dessus on peut s'inscrire

                <div
                  key={index}
                  className={`w-full flex h-full border bg-white hover:cursor-pointer`}
                  style={{ borderColor: getColorFromLabel(event.label) }}
                  onClick={() => {
                    setEventToSend(event);
                    setShowModal(true);
                  }}
                >
                  <div
                    className={`w-1/3 ${event.label} p-2 text-center text-white`}
                  >
                    <p className="">{new Date(event.day).getDate()}</p>
                    <p>
                      {new Date(event.day).toLocaleString("default", {
                        month: "long",
                      })}
                    </p>
                  </div>
                  <div className="w-2/3 p-4 pl-4">
                    <h3 className="text-black">{event.title}</h3>
                    <p className="text-gray-500">{event.description}</p>
                  </div>
                  {event.participantsUsernames.includes(
                    sessionStorage.getItem("username") as string
                  ) ? (
                    <div className="w-1/3 bg-green-500 p-2 text-center text-white">
                      INSCRIT
                    </div>
                  ) : (
                    <div className="pr-2 text-center text-green-500">
                      S'inscrire
                    </div>
                  )}
                  {event.isFull ? (
                    <div className="w-1/3 bg-red-500 p-2 text-center text-white">
                      FULL
                    </div>
                  ) : (
                    <div className="pr-2 text-center text-red-500">Full</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
          <div className="h-[42%] w-full">B </div>
        </div>
        <div className="flex w-[44%] flex-row shadow-md border border-black ml-2">
          <div className="flex w-full flex-col rounded-l-md bg-white">
            <h2 className="pl-7 pt-4">LES GRANDS GAGNANTS DE LA SEMAINE</h2>
            <ul className="w-full items-center justify-center pl-7 pt-2">
              {bestPlayers.map((player, index) => (
                <li key={index} className="pb-2">
                  <img
                    src={player.img}
                    alt={player.name}
                    className="border-gray mr-2 inline-block h-12 w-12 rounded-full border object-cover shadow-md hover:border-green-500"
                  />
                  {player.name}
                  {` `}
                  {player.gain}
                </li>
              ))}
            </ul>
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
{
  /*

*/
}
