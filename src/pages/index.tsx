import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "~/components/Modal";
import EventSubscribeModal from "~/components/EventSubscribeModal";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import PokerImage from "../utils/images/poker.svg";
import Position from "../utils/images/position.svg";
import ClockIcon from "../utils/images/clockicon.svg";
import QuestionMark from "../utils/images/questionmark.svg";
import Versus from "../utils/images/versus.png";
import { useMediaQuery } from "react-responsive";
import io from "socket.io-client";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import axios from "axios";
import EventProfileModal from "~/components/EventProfileModal";
import LiveChallengeModal from "~/components/LiveChallengeModal";
import { set } from "lodash";
import DefiModalContent from "~/components/DefiModalContent";

interface publicChallenge {
  id: string;
  creatorName: string;
  opponentName: string;
  creatorImage: string;
  opponentImage: string;
  creatorBid: number;
  opponentBid: number;
  gameSelected: string;
  contractTerms: string;
  bid: number;
  timerPublic: number;
  winner: string
}

interface Event {
  title: string;
  description: string;
  label: string;
  day: number;
  id: number;
  participantsUsernames: string[];
  isFull: boolean;
  isEventOfTheWeek: boolean;
}

export default function HomePage() {
  const [weeklyEvents, setWeeklyEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showBigModal, setShowBigModal] = useState<boolean>(false);
  const [eventOTW, setEventOTW] = useState<Event>();
  const [eventToSend, setEventToSend] = useState<Event>();
  const [playerOTW, setPlayerOTW] = useState<PlayerProps>();
  const [publicChallenges, setPublicChallenges] = useState<publicChallenge[]>(
    []
  );
  const [showContratModal, setShowContratModal] = useState<boolean>(false);
  const [contratInformation, setContratInformation] =
    useState<publicChallenge>();

  const [publicChallengesBool, setPublicChallengesBool] = useState<boolean>(false)


  const [socket, setSocket] = useState<any>(null);

  async function setWeekly() {
    const today = dayjs().startOf("day");
    const tenDaysFromNow = dayjs().add(10, "day");
    const request = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/events/incoming-events/"
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
      const isEventOfTheWeek = events.find((event) => event.isEventOfTheWeek);
      setEventOTW(isEventOfTheWeek);
      // console.log(`is event of the week`, isEventOfTheWeek);
      setWeeklyEvents(events);
    }
  }

  async function getPublicChallenges() {
    const request = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/defi/get_all_public_challenges/"
    );

    if (request.data.success == true) {
      setPublicChallenges(request.data.publicChallenges);
      setPublicChallengesBool(true)
    }
    else console.error(request.data.error);
  }

  useEffect(() => {
    setWeekly();
    getPublicChallenges();

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
    setSocket(socket);
  }, []);


  useEffect(() => {
    if (socket == null) return;
    socket.emit("joinDefi", { username: sessionStorage.getItem('username') });

    socket.on("receiveDefiId", (data: { defiId: string }) => {
      window.location.href = "/defi/" + data.defiId;
      sessionStorage.setItem("defiId", data.defiId);
    });

    return () => {
      socket.emit("leaveDefi", { username: sessionStorage.getItem('username') });
      socket.disconnect();
      socket.off();
    };
  }, [socket]);

  async function setFix() {
    let publicChallengesCpy = [...publicChallenges];
    const promises = publicChallengesCpy.map((challenge) =>
      asyncFix(challenge.id)
        .then((bid) => {
          challenge.bid = bid.bid;
          challenge.winner = bid.winner;
        })
        .catch((error) => {
          console.error(error);
        })
    );

    await Promise.all(promises);

    setPublicChallenges(publicChallengesCpy);
    console.log(publicChallengesCpy);
  }

  useEffect(() => {
    setFix();
  }, [publicChallengesBool]);


  function getColorFromLabel(label: any) {
    const parts = label.split("-");
    return parts[1]; // cela renvoie "red" si label est "bg-red-500"
  }
  function getName(label: any) {
    const parts = label.split(" ");
    return parts[0];
  }

  async function asyncFix(id: string) {
    const request = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/defi/user_bet_on_public_challenge/", JSON.stringify({ username: sessionStorage.getItem("username"), challengeId: id })
      , { headers: { "Content-Type": "application/json" } })
    if (request.data.success == true) {
      console.log("returned", request.data, "ici")
      return { bid: request.data.userBet, winner: request.data.winner }
    }
    else {
      console.log(request.data.error)
      return { 0: 0 }
    }
  }

  interface PlayerProps {
    username: string;
    image: string;
    balance: number;
    statusMessage: string;
    classment: string;
  }
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  async function BestPlayersOfTheWeek() {
    const request = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/user/get_top_users/"
    );
    const topUsers = request.data.topUsers;
    // console.log(`those are the top Users`, topUsers);
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
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  if (isMobile) {
    return (
      <div className="h-full w-full space-y-2">
        <div className="h-[80%] w-full space-y-2 overflow-auto">
          <div className="mb-4 h-[25%] w-full">
            <Image
              src={PokerImage}
              width={400}
              height={200}
              alt="Event of the Week"
              className="rounded-md shadow-md"
              onClick={() => {
                setEventToSend(eventOTW);
                setShowBigModal(true);
              }}
            />
          </div>
          <div className="relative flex h-[35%] w-full flex-col bg-white shadow-md">
            <h1 className="pl-7 pt-4 text-[13px] font-bold">Live</h1>
            <button className="absolute right-2 top-3.5 rounded-full border border-black p-1">
              <Image
                src={QuestionMark}
                alt="questionMark"
                width={11}
                height={11}
              />
            </button>
            {publicChallenges.map((challenge: any) => (
              <div
                key={challenge.id}
                className="relative mx-6 mt-4 h-1/3 w-[88%] rounded-md border border-black bg-[#272A30]"
              >
                <Image
                  src={challenge.creatorImage}
                  alt="Challenge image"
                  width={60}
                  height={60}
                  className="absolute left-[15%] top-[10%] rounded-full border border-white shadow-md"
                />
                <Image
                  src={challenge.opponentImage}
                  alt="Opponent image"
                  width={60}
                  height={60}
                  className="absolute right-[15%] top-[10%] rounded-full border border-white shadow-md"
                />
                <Image
                  src={Versus}
                  alt="versus"
                  width={40}
                  height={40}
                  className="absolute left-[43%] top-[13%]"
                />
                <p className="absolute left-[45%] top-[44%] text-[12px] text-white">
                  {challenge.creatorBid} : {challenge.opponentBid}
                </p>
                <button
                  className="absolute left-[43%] top-[64%] rounded-md border border-white bg-[#DD0000] p-1 text-sm text-white"
                  onClick={() => {
                    setShowContratModal(true), setContratInformation(challenge);
                  }}
                >
                  Miser
                </button>
                {challenge.bid != 0 ? (
                  <p className="text-white text-xs block mt-32">Tu as misé {challenge.bid} sur la victoire de {challenge.winner}</p>
                ) : <p className="text-white text-xs block mt-32">Tu n'as pas encore misé sur ce challenge !</p>}
              </div>
            ))}
          </div>
          <div className="h-[36%] w-full overflow-hidden rounded-md bg-white shadow-md">
            <h2 className="mb-2 pl-7 pt-4 text-[13px] font-bold">Evenements</h2>
            <div className="flex items-center justify-center overflow-auto rounded-b-md bg-white px-2">
              <div className="max-h-28 w-[90%]">
                <div className="h-full w-full">
                  {weeklyEvents.map((event: Event, index: number) => (
                    // Première chose, if event.isFull == true event marqué comme full + quand on click dessus on peut pas s'inscrire
                    // Deuxième chose si sessionStorage.getItem('username') est dans event.participantsUsernames marqué event comme inscrit
                    // et quand on click dessus on peut se désinscrire
                    // Sinon juste afficher l'event et quand on click dessus on peut s'inscrire

                    <div
                      key={index}
                      className={`mb-2 flex h-10 w-full rounded-md border bg-white hover:cursor-pointer`}
                      style={{ borderColor: getColorFromLabel(event.label) }}
                      onClick={() => {
                        setEventToSend(event);
                        setShowModal(true);
                      }}
                    >
                      <div
                        className={`w-1/3 ${event.label} flex flex-col items-center justify-center rounded-l-md text-center text-[10px] text-white`}
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
                            className="h-1/3 text-[10px] text-black"
                            style={{ color: getColorFromLabel(event.label) }}
                          >
                            {event.title}
                          </h3>
                          <p className="flex h-1/3 items-center overflow-hidden pl-2 text-[8px] text-gray-500">
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
          </div>
          <div className="h-[25%] w-full rounded-md bg-white">
            <h1 className="flex h-[20%] items-center pl-7 pt-2 text-[12px] font-bold">
              Joueurs de la semaine
            </h1>
            <div className="flex h-[80%] w-full">
              {players?.map((player, index) => (
                <div
                  key={index}
                  className={`mr-1 flex h-full w-full flex-grow flex-col items-center`}
                >
                  <Image
                    src={player.image}
                    width={80}
                    height={80}
                    alt="Player Image"
                    className={`${index === 1 ? "shadow-xl" : "shadow-md"
                      } rounded-md pt-2 duration-200 hover:scale-110`}
                    onClick={() => {
                      setShowUserModal(true), setPlayerOTW(player);
                    }}
                  />
                  <p className="flex w-full justify-center pt-1 text-[10px]">
                    {index + 1}
                    {index + 1 === 1 && "st"}
                    {index + 1 === 2 && "nd"}
                    {index + 1 === 3 && "rd"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-[19%] w-full items-center justify-center bg-custom-color">
          <button
            type="button"
            className="mx-2 h-[50%] w-[80%] rounded-md bg-red-600 px-2 py-3 text-sm font-semibold text-white shadow-md duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => {
              setShowModal(true)
            }}
          >
            Defier un challenger
          </button>
        </div>
        <Modal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          width="w-[350px]"
        >
          <DefiModalContent socket={socket} onClose={() => setShowModal(false)} />
        </Modal>
        {eventToSend != undefined ? (
          <Modal
            isVisible={showModal}
            onClose={() => setShowModal(false)}
            width="w-[300px]"
            verticalPosition="100px"
          >
            <EventSubscribeModal
              eventToSend={eventToSend}
              showModal={setShowModal}
              setWeekly={setWeekly}
            />
          </Modal>
        ) : null}
        {eventOTW !== undefined ? (
          <Modal
            isVisible={showBigModal}
            onClose={() => setShowBigModal(false)}
            width="w-[300px]"
            verticalPosition="200px"
          >
            <EventSubscribeModal
              eventToSend={eventOTW}
              showModal={setShowBigModal}
              setWeekly={setWeekly}
            />
          </Modal>
        ) : null}
        {playerOTW !== undefined ? (
          <Modal
            isVisible={showUserModal}
            onClose={() => setShowUserModal(false)}
            width="w-[300px]"
          >
            <EventProfileModal userProfile={playerOTW} showAddFriend={true} />
          </Modal>
        ) : null}
        {contratInformation !== undefined ? (
          <Modal
            isVisible={showContratModal}
            onClose={() => setShowContratModal(false)}
            width="w-[300px]"
          >
            <LiveChallengeModal contractInformation={contratInformation} />
          </Modal>
        ) : null}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col">
      <button
        className="flex h-2/5 w-full items-center justify-center overflow-hidden rounded-[15px] shadow-md"
        onClick={() => {
          setEventToSend(eventOTW);
          // console.log(eventOTW)
          setShowBigModal(true);
          // console.log(`showBigModal`, showBigModal);
        }}
      >
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
            <div className="flex overflow-auto rounded-b-md bg-white px-2">
              <div className="max-h-32 w-full">
                <div className="h-full w-full">
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
          </div>
          <div className="h-[42%] w-full rounded-md bg-white">
            <h1 className="flex h-[20%] items-center pl-7 font-bold">
              Joueurs de la semaine
            </h1>
            <div className="flex h-[80%] w-full">
              {players?.map((player, index) => (
                <div
                  key={index}
                  className={`mr-1 flex h-full w-full flex-grow flex-col items-center hover:cursor-pointer`}
                >
                  <Image
                    src={player.image}
                    width={100}
                    height={100}
                    alt="Player Image"
                    className={`${index === 1 ? "shadow-xl" : "shadow-md"
                      } rounded-md duration-200 hover:scale-110`}
                    onClick={() => {
                      setShowUserModal(true), setPlayerOTW(player);
                    }}
                  />
                  <p className="flex w-full justify-center pt-1 text-[10px]">
                    {index + 1}
                    {index + 1 === 1 && "st"}
                    {index + 1 === 2 && "nd"}
                    {index + 1 === 3 && "rd"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" relative ml-2 flex h-full w-[44%] flex-col bg-white shadow-md">
          <h1 className="pl-7 pt-4 text-[13px] font-bold">Live</h1>
          <button className="absolute right-4 top-4 rounded-full border border-black p-1">
            <Image
              src={QuestionMark}
              alt="questionMark"
              width={15}
              height={15}
            />
          </button>
          {publicChallenges.map((challenge: any) => (
            <div
              key={challenge.id}
              className="relative mx-6 mt-4 h-1/3 w-[88%] rounded-md border border-black bg-[#272A30]"
            >
              <Image
                src={challenge.creatorImage}
                alt="Challenge image"
                width={60}
                height={60}
                className="absolute left-[15%] top-[10%] rounded-full border border-white shadow-md"
              />
              <Image
                src={challenge.opponentImage}
                alt="Opponent image"
                width={60}
                height={60}
                className="absolute right-[15%] top-[10%] rounded-full border border-white shadow-md"
              />
              <Image
                src={Versus}
                alt="versus"
                width={40}
                height={40}
                className="absolute left-[43%] top-[13%]"
              />
              <p className="absolute left-[45%] top-[44%] text-[12px] text-white">
                {challenge.creatorBid} : {challenge.opponentBid}
              </p>
              <button
                className="absolute left-[43%] top-[64%] rounded-md border border-white bg-[#DD0000] p-1 text-sm text-white"
                onClick={() => {
                  setShowContratModal(true), setContratInformation(challenge);
                }}
              >
                Miser
              </button>
              {challenge.bid != 0 ? (
                <p className="text-white text-xs block mt-32">Tu as misé {challenge.bid} sur la victoire de {challenge.winner}</p>
              ) : <p className="text-white text-xs block mt-32">Tu n'as pas encore misé sur ce challenge !</p>}
            </div>
          ))}
        </div>
      </div>
      {eventToSend != undefined ? (
        <Modal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          width="w-[600px]"
          verticalPosition="80px"
        >
          <EventSubscribeModal
            eventToSend={eventToSend}
            showModal={setShowModal}
            setWeekly={setWeekly}
          />
        </Modal>
      ) : null}
      {eventOTW !== undefined ? (
        <Modal
          isVisible={showBigModal}
          onClose={() => setShowBigModal(false)}
          width="w-[600px]"
          verticalPosition="300px"
        >
          <EventSubscribeModal
            eventToSend={eventOTW}
            showModal={setShowBigModal}
            setWeekly={setWeekly}
          />
        </Modal>
      ) : null}
      {playerOTW !== undefined ? (
        <Modal
          isVisible={showUserModal}
          onClose={() => setShowUserModal(false)}
          width="w-[500px]"
        >
          <EventProfileModal userProfile={playerOTW} showAddFriend={true} />
        </Modal>
      ) : null}
      {contratInformation !== undefined ? (
        <Modal
          isVisible={showContratModal}
          onClose={() => setShowContratModal(false)}
          width="w-[500px]"
        >
          <LiveChallengeModal contractInformation={contratInformation} />
        </Modal>
      ) : null}
    </div>
  );
}
