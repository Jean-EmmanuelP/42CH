import React, { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalContext from "~/context/GlobalContext";
import Pusher from "pusher-js";
import { api } from "~/utils/api";
import axios from "axios";
import { createReactProxyDecoration } from "@trpc/react-query/shared";
import Modal from "./Modal";
import DefiModalContent from "./DefiModalContent";
import io from "socket.io-client";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const DefiRightBar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const { setChallengeData } = useContext(GlobalContext);

  // State
  const username = sessionStorage.getItem('username');
  const [challenges, setChallenges] = useState<string[]>([]);
  const [creatorId, setCreatorId] = useState<string>("");
  const [challengeArray, setChallengeArray] = useState<any[]>([]);
  const [defiRequestArray, setDefiRequestArray] = useState<any[]>([]);
  const [ongoingDefiArray, setOngoingDefiArray] = useState<any[]>([]);
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
    else
      console.error(request.data.error);
  }

  useEffect(() => {
    getFriendRequests()
  }, [])

  useEffect(() => {
    const request = axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/get_all_challenges/",
      JSON.stringify({ username: sessionStorage.getItem("username"), accessToken: sessionStorage.getItem("accessToken") }),
      { headers: { "Content-Type": "application/json" } }
    );
    request.then((response) => {
      if (response.data.success === true) {
        sessionStorage.setItem('accessToken', response.data.accessToken)
        setChallengeArray(response.data.challenges);
      }
      else {
        if (response.data.error === "Token") {
          sessionStorage.removeItem('accessToken')
          window.location.href = "/"
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
    else
      console.error(request.data.error);
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
  return (
    <div className="flex h-full flex-col rounded-l-md bg-white shadow-md">
      <div className="mb-6 pl-2 pt-2">
        <select className="text-l font-bold">
          <option value="Mes Defis">Mes Defis</option>
          <option value="Mes Paris">Mes Paris</option>
        </select>
      </div>
      <div className="mb-2 flex w-full">
        {tabs.map((tab: any) => (
          <button
            key={tab.value}
            className={`flex-grow ${tab.value === activeTab ? "font-bold" : ""
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
                <div className="absolute w-3/4 mx-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
                  <h1 className="font-bold mb-4">Ajoute un defi !</h1>
                  <p className="">Rempli ton wallet de coin en vidant celui des autres, et devient le meilleur joueur de 42</p>
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
        {activeTab === "Invitations" && (
          <div>
            {defiRequestArray ? <p className="mb-2">Demande de defi</p> : <></>}
            {defiRequestArray?.map((defiRequest, index) => {
              return (
                <div
                  key={index}
                  className="m-5 flex flex-col items-center gap-4 rounded bg-white p-5 shadow-md"
                >
                  <p className="text-l mb-2 font-semibold">
                    {defiRequest.receiverUsername}
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

          <div className="overflow-y-auto w-full h-full"> {friendRequests != null ? (friendRequests.map((friendRequest, index) => {
            return (
              <div className="flex w-full h-16 rounded border-1 border-black bg-gray-450 p-2 text-black shadow-md">
                <img
                  className="w-[14%] h-[100%] rounded-full inline top-0 left-0 mr-4"
                  src={friendRequest.image}
                >
                </img>
                <p className="w-[40%] inline text-l h-full">{friendRequest.username}</p>
                <button
                  className="w-[24%] mr-[2%] inline rounded border-2 border-green-500 bg-green-500 text-white shadow-md text-sm"
                  onClick={async () => {
                    const request = await axios.post(
                      process.env.NEXT_PUBLIC_API_URL + "/user/accept_friend/",
                      JSON.stringify({ username: sessionStorage.getItem("username"), toAcceptUsername: friendRequest.username }),
                      { headers: { "Content-Type": "application/json" } }
                    );
                    if (request.data.success === true) {
                      window.location.reload()
                    }
                    else {
                      console.error(request.data.error);
                    }
                  }}
                >
                  Accepter
                </button>
                <button
                  className="w-[24%] inline rounded border-2 border-red-500 bg-red-500 p-2 text-white shadow-md text-sm"
                  onClick={async () => {
                    const request = await axios.post(
                      process.env.NEXT_PUBLIC_API_URL + "/user/decline_friend/",
                      JSON.stringify({ username: sessionStorage.getItem("username"), toDeclineUsername: friendRequest.username }),
                      { headers: { "Content-Type": "application/json" } }
                    );
                    if (request.data.success === true) {
                      window.location.reload()
                    }
                    else {
                      console.error(request.data.error);
                    }
                  }}
                >
                  Refuser
                </button>
              </div>
            );
          })) : null}</div>
        )}
      </div>
      <div className="mb-2 w-full pb-2 flex justify-center">
        <button
          type="button"
          className="hover:scale-110 duration-300 w-5/6 mx-2 rounded-md bg-red-600 px-2 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => setShowModal(true)}
        >
          Defier un challenger
        </button>
      </div>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)} width="w-[600px]">
        <DefiModalContent socket={socket} onClose={() => setShowModal(false)} />
      </Modal>
      <Modal isVisible={showModalFin} onClose={() => setShowModalFin(false)} width="w-[600px]">
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
    </div>
  );
};
export default DefiRightBar;
