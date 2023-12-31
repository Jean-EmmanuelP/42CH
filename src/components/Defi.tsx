import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "./Modal";
import DefiModalContent from "./DefiModalContent";
import io from "socket.io-client";
import getConfig from "next/config";
import { useMediaQuery } from "react-responsive";
const { publicRuntimeConfig } = getConfig();
import CloseIcon from "../utils/images/CloseImage.svg";
import Image from "next/image";

interface DefiRightBarProps {
  onClose?: () => void;
}

export default function DefiRightBar({ onClose }: DefiRightBarProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  // State
  const username = sessionStorage.getItem("username");
  const [challengeArray, setChallengeArray] = useState<any[]>([]);
  const [defiRequestArray, setDefiRequestArray] = useState<any[]>([]);
  const [showModalFin, setShowModalFin] = useState<boolean>(false);
  const [challengeOpened, setChallengeOpened] = useState<any>(null);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);

  async function getFriendRequests() {
    const request = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/user/get_friend_requests/",
      JSON.stringify({ username: sessionStorage.getItem("username") }),
      { headers: { "Content-Type": "application/json" } }
    );
    if (request.data.success === true)
      setFriendRequests(request.data.friendRequests);
    else console.error(request.data.error);
  }

  useEffect(() => {
    getFriendRequests();
  }, []);

  useEffect(() => {
    const request = axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/get_all_challenges/",
      JSON.stringify({
        username: sessionStorage.getItem("username"),
        accessToken: sessionStorage.getItem("accessToken"),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    request.then((response) => {
      if (response.data.success === true) {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        setChallengeArray(response.data.challenges);
      } else {
        if (response.data.error === "Token") {
          sessionStorage.removeItem("accessToken");
          window.location.href = "/";
        }
        console.error(response.data.error);
      }
    });
    const request2 = axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/ongoing/",
      JSON.stringify({ username: sessionStorage.getItem("username") }),
      { headers: { "Content-Type": "application/json" } }
    );
    request2.then((response) => {
      if (response.data.success === true)
        setDefiRequestArray(response.data.defiRequests);
      else {
        console.error(response.data.error);
      }
    });
    fetchDefiRequestArray();
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
    setSocket(socket);
  }, [username]);

  useEffect(() => {
    if (socket == null) return;
    socket.emit("joinDefi", { username: username });

    socket.on("receiveDefi", () => {
      fetchDefiRequestArray();
    });

    socket.on("receiveDefiId", (data: { defiId: string }) => {
      window.location.href = "/defi/" + data.defiId;
      sessionStorage.setItem("defiId", data.defiId);
    });

    return () => {
      socket.emit("leaveDefi", { username: username });
      socket.disconnect();
      socket.off();
    };
  }, [username, socket]);

  async function fetchDefiRequestArray() {
    const request = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/get_all_defi_requests",
      JSON.stringify({ username: username }),
      { headers: { "Content-Type": "application/json" } }
    );
    if (request.data.success === true)
      setDefiRequestArray(request.data.defiRequests);
    else console.error(request.data.error);
  }

  const handleAcceptChallenge = async (index: number) => {
    const request = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/create",
      JSON.stringify({
        creatorUsername: defiRequestArray[index].senderUsername,
        opponentUsername: username,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    if (request.data.success === true) {
      // will need to add another way to join a defi requets later
      socket.emit("sendDefiId", {
        toDelete: defiRequestArray[index].id,
        senderUsername: defiRequestArray[index].senderUsername,
        defiId: request.data.defiId,
      });
      window.location.href = "/defi/" + request.data.defiId;
      sessionStorage.setItem("defiId", request.data.defiId);
    }
  };

  const handleRejectChallenge = (index: number) => {
    const request = axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/delete_defi_request/",
      JSON.stringify({ id: defiRequestArray[index].id }),
      { headers: { "Content-Type": "application/json" } }
    );
    request.then((response) => {
      if (response.data.success === true) {
        fetchDefiRequestArray();
      } else {
        console.error(response.data.error);
      }
    });
  };

  function extractUsername(email: string) {
    return email.split(" ")[0];
  }

  function sumUp(number1: number, number2: number) {
    return number1 + number2;
  }
  // Render
  const [activeTab, setActiveTab] = useState("En cours");

  const tabs = [
    { label: "En cours", value: "En cours", position: 0 },
    { label: "Invitations", value: "Invitations", position: 1 },
    { label: "Demande d'amis", value: "Amis", position: 2 },
  ];
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  if (isMobile) {
    return (
      <div className="absolute inset-0 top-[9%] z-10 bg-white text-[#] text-black">
        <div className="mb-6 flex flex items-center justify-between pl-2 pt-2">
          <p className="font-bold">Tableau de bord</p>

          <button className="pr-1">
            <Image
              src={CloseIcon}
              width={30}
              height={30}
              alt="Close Icon"
              onClick={onClose}
            />
          </button>
        </div>
        <div className="mb-2 flex w-full">
          {tabs.map((tab: any) => (
            <button
              key={tab.value}
              className={`flex-grow ${tab.value === activeTab ? "w-1/3 p-1 font-bold" : "w-1/3 p-1"
                }`}
              onClick={() => {
                setActiveTab(tab.value);
                setSelectedTab(tab.position);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative h-px w-full bg-[#272A30]">
          <div
            style={{
              transform: `translateX(${(selectedTab * 300) / tabs.length}%)`,
            }}
            className={`absolute h-0.5 w-1/3 bg-[#272A30] transition-transform duration-500 ease-in-out`}
          />
        </div>
        {
          friendRequests && friendRequests.length > 0 ? (
            <p className="absolute left-[95%] top-[7%] text-sm text-red-500">+{friendRequests.length}</p>
          ) :
            null
        }

        {
          defiRequestArray && defiRequestArray.length > 0 ? (
            <p className="absolute left-[60%] top-[7%] text-sm text-red-500">+{defiRequestArray.length}</p>
          ) :
            null
        }
        <div className="relative mb-3 h-full w-full overflow-y-auto">
          {activeTab === "En cours" && (
            <div className="relative flex h-full flex-col">
              {challengeArray.length > 1 ? (
                <p className="mb-2">Defi en cours</p>
              ) : (
                <>
                  <div className="absolute left-1/2 top-1/2 mx-2 w-3/4 -translate-x-1/2 -translate-y-1/2 transform text-center">
                    <h1 className="mb-4 font-bold">Ajoute un defi !</h1>
                    <p className="">
                      Rempli ton wallet de coin en vidant celui des autres, et
                      devient le meilleur joueur de 42
                    </p>
                    <button
                      type="button"
                      className="mt-20 mx-2 w-5/6 rounded-md bg-red-600 px-2 py-3 text-sm font-semibold text-white shadow-md duration-300 hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() => setShowModal(true)}
                    >
                      Defier un challenger
                    </button>
                  </div>
                </>
              )}
              {challengeArray.map((challenge, index) => {
                return (
                  <div className="border-gray w-full rounded-md border pb-2 pl-2 pt-2 text-sm shadow-sm">
                    <p className="border-gray border-b p-2">
                      You vs {extractUsername(challenge.opponentName)} a changer
                    </p>
                    <div className="flex flex-col gap-2 p-2">
                      <p className="">Jeu : {challenge.gameSelected}</p>
                      <p className="">
                        Enjeu :{" "}
                        {sumUp(challenge.creatorBid, challenge.opponentBid)}{" "}
                        coin
                      </p>
                    </div>
                    {(challenge.creatorName ==
                      sessionStorage.getItem("username") &&
                      challenge.creatorAnswer == false) ||
                      (challenge.opponentName ==
                        sessionStorage.getItem("username") &&
                        challenge.opponentAnswer == false) ? (
                      <button
                        onClick={() => {
                          setShowModalFin(true);
                          setChallengeOpened(challenge);
                        }}
                        className="ml-2 items-center justify-center rounded-md border border-red-500 bg-black/25 p-2 tracking-wide text-red-500 shadow-sm"
                      >
                        Fin du DEFI
                      </button>
                    ) : (
                      <p>En attente de l'adversaire...</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "Invitations" && (
            <div>
              {defiRequestArray ? (
                <p className="mb-2">Demande de defi</p>
              ) : (
                <></>
              )}
              {defiRequestArray?.map((defiRequest, index) => {
                return (
                  <div
                    key={index}
                    className="m-5 flex flex-col items-center gap-4 rounded bg-white p-5 shadow-md"
                  >
                    <p className="text-l mb-2 font-semibold">
                      {defiRequest.senderUsername}
                    </p>
                    <div>
                      <button
                        className="mr-2 rounded border-2 border-green-500 bg-green-500 p-2 text-white shadow-md"
                        onClick={() => handleAcceptChallenge(index)}
                      >
                        Accepter
                      </button>
                      <button
                        className="rounded border-2 border-red-500 bg-red-500 p-2 text-white shadow-md"
                        onClick={() => handleRejectChallenge(index)}
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {activeTab === "Amis" && (
            <div className="h-full w-full overflow-y-auto">
              {" "}
              {friendRequests != null
                ? friendRequests.map((friendRequest, index) => {
                  return (
                    <div className="border-1 bg-gray-450 flex h-16 w-full rounded border-black p-2 text-black shadow-md">
                      <img
                        className="left-0 top-0 mr-4 inline h-[100%] w-[14%] rounded-full"
                        src={friendRequest.image}
                      ></img>
                      <p className="text-l inline h-full w-[40%]">
                        {friendRequest.username}
                      </p>
                      <button
                        className="mr-[2%] inline w-[24%] rounded border-2 border-green-500 bg-green-500 text-sm text-white shadow-md"
                        onClick={async () => {
                          const request = await axios.post(
                            process.env.NEXT_PUBLIC_API_URL +
                            "/user/accept_friend/",
                            JSON.stringify({
                              username: sessionStorage.getItem("username"),
                              toAcceptUsername: friendRequest.username,
                            }),
                            {
                              headers: { "Content-Type": "application/json" },
                            }
                          );
                          if (request.data.success === true) {
                            window.location.reload();
                          } else {
                            console.error(request.data.error);
                          }
                        }}
                      >
                        Accepter
                      </button>
                      <button
                        className="inline w-[24%] rounded border-2 border-red-500 bg-red-500 p-2 text-sm text-white shadow-md"
                        onClick={async () => {
                          const request = await axios.post(
                            process.env.NEXT_PUBLIC_API_URL +
                            "/user/decline_friend/",
                            JSON.stringify({
                              username: sessionStorage.getItem("username"),
                              toDeclineUsername: friendRequest.username,
                            }),
                            {
                              headers: { "Content-Type": "application/json" },
                            }
                          );
                          if (request.data.success === true) {
                            window.location.reload();
                          } else {
                            console.error(request.data.error);
                          }
                        }}
                      >
                        Refuser
                      </button>
                    </div>
                  );
                })
                : null}
            </div>
          )}
        </div>
        <Modal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          width="w-[350px]"
        >
          <DefiModalContent
            socket={socket}
            onClose={() => setShowModal(false)}
          />
        </Modal>
        <Modal
          isVisible={showModalFin}
          onClose={() => setShowModalFin(false)}
          width="w-[350px]"
        >
          <div className="items-center gap-2">
            <p className="block items-center text-xl font-bold">
              Qui a gagné ?
            </p>
            {challengeOpened != null ? (
              <>
                <button
                  onClick={async () => {
                    const request = await axios.post(
                      process.env.NEXT_PUBLIC_API_URL + "/defi/finish",
                      JSON.stringify({
                        username: sessionStorage.getItem("username"),
                        challengeId: challengeOpened.id,
                        winner: challengeOpened.creatorName,
                      }),
                      { headers: { "Content-Type": "application/json" } }
                    );
                    setShowModalFin(false);
                    window.location.href = "/";
                  }}
                  className="inline border border-black text-xl"
                >
                  {challengeOpened?.creatorName}
                </button>
                <button
                  onClick={async () => {
                    const request = await axios.post(
                      process.env.NEXT_PUBLIC_API_URL + "/defi/finish",
                      JSON.stringify({
                        username: sessionStorage.getItem("username"),
                        challengeId: challengeOpened.id,
                        winner: challengeOpened.opponentName,
                      }),
                      { headers: { "Content-Type": "application/json" } }
                    );
                    setShowModalFin(false);
                    window.location.href = "/";
                  }}
                  className="sticky right-0 inline border border-black text-xl"
                >
                  {challengeOpened?.opponentName}
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </Modal>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col rounded-l-md bg-white shadow-md">
      <div className="mb-6 pl-2 pt-2">
        <p className="font-bold">Tableau de bord</p>
      </div>

      <div className="mb-2 flex w-full">
        {tabs.map((tab: any) => (
          <button
            key={tab.value}
            className={`flex-grow ${tab.value === activeTab ? "w-1/3 p-1 font-bold" : "w-1/3 p-1"
              }`}
            onClick={() => {
              setActiveTab(tab.value);
              setSelectedTab(tab.position);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative h-px w-full bg-[#272A30]">
        <div
          style={{
            transform: `translateX(${(selectedTab * 300) / tabs.length}%)`,
          }}
          className={`absolute h-0.5 w-1/3 bg-[#272A30] transition-transform duration-500 ease-in-out`}
        />
      </div>
      <div className="mb-3 h-full w-full overflow-y-auto">
        {activeTab === "En cours" && (
          <div className="relative flex h-full flex-col">
            {challengeArray.length > 1 ? (
              <p className="mb-2">Defi en cours</p>
            ) : (
              <>
                <div className="absolute left-1/2 top-1/2 mx-2 w-3/4 -translate-x-1/2 -translate-y-1/2 transform text-center">
                  <h1 className="mb-4 font-bold">Ajoute un defi !</h1>
                  <p className="">
                    Rempli ton wallet de coin en vidant celui des autres, et
                    devient le meilleur joueur de 42
                  </p>
                </div>
              </>
            )}
            {challengeArray.map((challenge, index) => {
              return (
                <div className="border-gray w-full rounded-md border pb-2 pl-2 pt-2 text-sm shadow-sm">
                  <p className="border-gray border-b p-2">
                    You vs {extractUsername(challenge.opponentName)} a changer
                  </p>
                  <div className="flex flex-col gap-2 p-2">
                    <p className="">Jeu : {challenge.gameSelected}</p>
                    <p className="">
                      Enjeu :{" "}
                      {sumUp(challenge.creatorBid, challenge.opponentBid)} coin
                    </p>
                  </div>
                  {(challenge.creatorName ==
                    sessionStorage.getItem("username") &&
                    challenge.creatorAnswer == false) ||
                    (challenge.opponentName ==
                      sessionStorage.getItem("username") &&
                      challenge.opponentAnswer == false) ? (
                    <button
                      onClick={() => {
                        setShowModalFin(true);
                        setChallengeOpened(challenge);
                      }}
                      className="ml-2 items-center justify-center rounded-md border border-red-500 bg-black/25 p-2 tracking-wide text-red-500 shadow-sm"
                    >
                      Fin du DEFI
                    </button>
                  ) : (
                    <p>En attente de l'adversaire...</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {
          defiRequestArray && defiRequestArray.length > 0 ? (
            <p className="absolute left-[88%] top-[20%] text-sm text-red-500">+{defiRequestArray.length}</p>
          ) :
            null
        }
        {
          friendRequests && friendRequests.length > 0 ? (
            <p className="absolute left-[97%] top-[18%] text-sm text-red-500">+{friendRequests.length}</p>
          ) :
            null
        }
        {activeTab === "Invitations" && (
          <div className="relative flex h-full w-full">
            {defiRequestArray ? <>
              <div className="absolute left-1/2 top-1/2 mx-2 w-3/4 -translate-x-1/2 -translate-y-1/2 transform text-center">
                <h1 className="mb-4 font-bold">Ajoute un defi !</h1>
                <p className="">
                  Rempli ton wallet de coin en vidant celui des autres, et
                  devient le meilleur joueur de 42
                </p>
              </div>
            </> : <></>}
            {
              defiRequestArray?.map((defiRequest, index) => {
                return (
                  <div
                    key={index}
                    className="m-5 flex flex-col items-center gap-4 rounded bg-white p-5 shadow-md"
                  >
                    <p className="text-l mb-2 font-semibold">
                      {defiRequest.senderUsername}
                    </p>
                    <div>
                      <button
                        className="mr-2 rounded border-2 border-green-500 bg-green-500 p-2 text-white shadow-md"
                        onClick={() => handleAcceptChallenge(index)}
                      >
                        Accepter
                      </button>
                      <button
                        className="rounded border-2 border-red-500 bg-red-500 p-2 text-white shadow-md"
                        onClick={() => handleRejectChallenge(index)}
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                );
              })
            }
          </div >
        )}
        {
          activeTab === "Amis" && (
            <div className="h-full w-full overflow-y-auto">
              {" "}
              {friendRequests != null
                ? friendRequests.map((friendRequest, index) => {
                  return (
                    <div className="border-1 bg-gray-450 flex h-16 w-full rounded border-black p-2 text-black shadow-md">
                      <img
                        className="left-0 top-0 mr-4 inline h-[100%] w-[14%] rounded-full"
                        src={friendRequest.image}
                      ></img>
                      <p className="text-l inline h-full w-[40%]">
                        {friendRequest.username}
                      </p>
                      <button
                        className="mr-[2%] inline w-[24%] rounded border-2 border-green-500 bg-green-500 text-sm text-white shadow-md"
                        onClick={async () => {
                          const request = await axios.post(
                            process.env.NEXT_PUBLIC_API_URL +
                            "/user/accept_friend/",
                            JSON.stringify({
                              username: sessionStorage.getItem("username"),
                              toAcceptUsername: friendRequest.username,
                            }),
                            { headers: { "Content-Type": "application/json" } }
                          );
                          if (request.data.success === true) {
                            window.location.reload();
                          } else {
                            console.error(request.data.error);
                          }
                        }}
                      >
                        Accepter
                      </button>
                      <button
                        className="inline w-[24%] rounded border-2 border-red-500 bg-red-500 p-2 text-sm text-white shadow-md"
                        onClick={async () => {
                          const request = await axios.post(
                            process.env.NEXT_PUBLIC_API_URL +
                            "/user/decline_friend/",
                            JSON.stringify({
                              username: sessionStorage.getItem("username"),
                              toDeclineUsername: friendRequest.username,
                            }),
                            { headers: { "Content-Type": "application/json" } }
                          );
                          if (request.data.success === true) {
                            window.location.reload();
                          } else {
                            console.error(request.data.error);
                          }
                        }}
                      >
                        Refuser
                      </button>
                    </div>
                  );
                })
                : null}
            </div>
          )
        }
      </div >
      <div className="mb-2 flex w-full justify-center pb-2">
        <button
          type="button"
          className="mx-2 w-5/6 rounded-md bg-red-600 px-2 py-3 text-sm font-semibold text-white shadow-md duration-300 hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => setShowModal(true)}
        >
          Defier un challenger
        </button>
      </div>
      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        width="w-[600px]"
      >
        <DefiModalContent socket={socket} onClose={() => setShowModal(false)} />
      </Modal>
      <Modal
        isVisible={showModalFin}
        onClose={() => setShowModalFin(false)}
        width="w-[600px]"
      >
        <div className="items-center gap-2">
          <p className="block items-center text-xl font-bold">Qui a gagné ?</p>
          {challengeOpened != null ? (
            <>
              <button
                onClick={async () => {
                  const request = await axios.post(
                    process.env.NEXT_PUBLIC_API_URL + "/defi/finish",
                    JSON.stringify({
                      username: sessionStorage.getItem("username"),
                      challengeId: challengeOpened.id,
                      winner: challengeOpened.creatorName,
                    }),
                    { headers: { "Content-Type": "application/json" } }
                  );
                  setShowModalFin(false);
                  window.location.href = "/";
                }}
                className="inline border border-black text-xl"
              >
                {challengeOpened?.creatorName}
              </button>
              <button
                onClick={async () => {
                  const request = await axios.post(
                    process.env.NEXT_PUBLIC_API_URL + "/defi/finish",
                    JSON.stringify({
                      username: sessionStorage.getItem("username"),
                      challengeId: challengeOpened.id,
                      winner: challengeOpened.opponentName,
                    }),
                    { headers: { "Content-Type": "application/json" } }
                  );
                  setShowModalFin(false);
                  window.location.href = "/";
                }}
                className="sticky right-0 inline border border-black text-xl"
              >
                {challengeOpened?.opponentName}
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </Modal>
    </div >
  );
}
