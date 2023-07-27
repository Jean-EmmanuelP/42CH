import { useContext, useEffect, useState } from "react";
import GlobalContext from "~/context/GlobalContext";
import Image from "next/image";
import EventOfTheWeek from "../utils/images/profileEvent.png";
import Modal from "~/components/Modal";
import EventSubscribeModal from "~/components/EventSubscribeModal";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import axios from "axios";

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

  // Hardcoded best and worst players
  const bestPlayers = [
    {
      name: "Dimitri",
      img: "https://www.didierdrogbafoundation.org/sites/default/files/didier-drogba.jpg",
      gain: "10000"
    },
    {
      name: "Oscar",
      img: "https://img.freepik.com/photos-gratuite/portrait-beau-jeune-homme-gros-plan_176420-15568.jpg",
      gain: "6500"
    },
    {
      name: "LeRusse",
      img: "https://www.superprof.fr/images/annonces/professeur-home-jeune-ingenieur-chinois-paris-capable-parler-francais-chinois-anglais.jpg",
      gain: "4800"
    },
  ];


  async function setWeekly() {
    const today = dayjs().startOf("day");
    const tenDaysFromNow = dayjs().add(10, "day");
    const request = await axios.get('http://localhost:3333/events/incoming-events/');
    request.data.forEach((element: Event) => {
      element.day = Number(element.day)
    });
    const events: Event[] = request.data.filter((evt: Event) =>
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
    <div className="mt-4 flex h-full w-full flex-col">
      <button className="flex h-1/2 w-full items-center justify-center overflow-hidden">
        <Image
          src={EventOfTheWeek}
          alt="Event of the Week"
          width={1300}
          height={1000}
          className="m-2 rounded-3xl object-cover"
        />
      </button>
      <div className="transparent mt-4 flex h-2/5 w-full gap-2">
        <div className="m-2 flex w-1/2 flex-col shadow-md bg-white">
          <h2 className="rounded-t-md bg-white pt-4 pl-7">AGENDA</h2>
          <div className="flex-grow overflow-auto rounded-b-md bg-white pr-2 mb-2 ml-4 mr-4">
            <div className="max-h-32">
              {weeklyEvents.map((event: Event, index: number) => (
                // Première chose, if event.isFull == true event marqué comme full + quand on click dessus on peut pas s'inscrire
                // Deuxième chose si sessionStorage.getItem('username') est dans event.participantsUsernames marqué event comme inscrit 
                // et quand on click dessus on peut se désinscrire
                // Sinon juste afficher l'event et quand on click dessus on peut s'inscrire
                <div
                  key={index}
                  className={`m-2 flex h-full border bg-white hover:cursor-pointer`}
                  style={{ borderColor: getColorFromLabel(event.label) }}
                  onClick={() => { setShowModal(true) }}
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
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="transparent m-2 flex w-1/2 flex-row gap-2 shadow-md">
          <div className="flex w-full flex-col rounded-l-md bg-white">
            <h2 className="pt-4 pl-7">LES GRANDS GAGNANTS DE LA SEMAINE</h2>
            <ul className="pt-2 pl-7 justify-center items-center w-full">
              {bestPlayers.map((player, index) => (
                <li key={index} className="pb-2">
                  <img
                    src={player.img}
                    alt={player.name}
                    className="border-gray mr-2 inline-block h-12 w-12 rounded-full border object-cover shadow-md hover:border-green-500"
                  />
                  {player.name}{` `}
                  {player.gain}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <EventSubscribeModal Event={Event} />
      </Modal>
    </div>
  );
}
