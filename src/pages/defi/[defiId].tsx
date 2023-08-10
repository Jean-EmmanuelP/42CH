"use client";

import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import GlobalContext from "~/context/GlobalContext";
import vsImage from "../../utils/images/versus_defiid.png";
import { api } from "~/utils/api";
import Image from "next/image";
import io from "socket.io-client";
import axios from "axios";
import { set } from "lodash";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

function DefiPage() {
  // need to fix this
  // const router = useRouter()
  // const path = router.asPath
  // // const roomNumber = path.split('/').pop()
  // const roomNumber = 123;
  const [roomNumber, setRoomNumber] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [gainTotal, setGainTotal] = useState<number>(0);
  const [userBet, setUserBet] = useState<number>(0);
  const [opponentBet, setOpponentBet] = useState<number>(0);
  const [mutualContract, setMutualContract] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [userComment, setUserComment] = useState<string>("");
  const [opponentComment, setOpponentComment] = useState<string>("");

  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(event.target.value);
    socket.emit("changeGame", {
      newGame: event.target.value,
      room: roomNumber,
      username: sessionStorage.getItem("username"),
    });
  };
  const [honorBet, setHonorBet] = useState<boolean>(false);
  const [opponentHonorBet, setOpponentHonorBet] = useState<boolean>(false);
  const handleHonorBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHonorBet(event.target.checked);
    socket.emit("changeHonorBet", {
      newHonorBet: event.target.checked,
      room: roomNumber,
      username: sessionStorage.getItem("username"),
    });
  };
  const [userAccepted, setUserAccepted] = useState<boolean>(false);
  const [opponentAccepted, setOpponentAccepted] = useState<boolean>(false);
  const [opponentId, setOpponnentId] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userImage, setUserImage] = useState<string>("");
  const [opponentBalance, setOpponentBalance] = useState<number>(0);
  const [opponentImage, setOpponentImage] = useState<string>("");
  const [opponentName, setOpponentName] = useState<string>("");

  useEffect(() => {
    if (socket == null) return;
    else
      socket.emit("join", { room: roomNumber });
  }, [roomNumber])

  useEffect(() => {
    if (roomNumber == 0) {
      const fixedRoomNumber = axios.post(process.env.NEXT_PUBLIC_API_URL + '/defi/get_room_number/', JSON.stringify({ username: sessionStorage.getItem("username") }), { headers: { "Content-Type": "application/json" } })
      fixedRoomNumber.then((fixedRoomNumber) => {
        if (fixedRoomNumber.data.success == true) {
          setRoomNumber(fixedRoomNumber.data.roomNumber);
        } else {
          console.error(fixedRoomNumber.data.message);
        }
      })
    }
    setIsClient(true);
    // check if id is in the url and exists in the database
    const request = axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/get_infos/",
      JSON.stringify({ username: sessionStorage.getItem("username"), /* accessToken: sessionStorage.getItem('access_token') */ }),
      { headers: { "Content-Type": "application/json" } }
    );
    request.then((request) => {
      if (request.data.success == true) {
        console.log("??", request.data)
        setUserBet(request.data.userBet);
        setOpponentBet(request.data.opponentBet);
        setHonorBet(request.data.honorBet);
        setOpponentHonorBet(request.data.opponentHonorBet);
        setOpponentAccepted(request.data.opponentAccepted);
        setUserAccepted(request.data.userAccepted);
        setMutualContract(request.data.mutualContract);
        setSelectedGame(request.data.selectedGame);
        setUserBalance(request.data.balance);
        setOpponentBalance(request.data.opponentBalance);
        setUserImage(request.data.image);
        setIsPublic(request.data.isPublic);
        const opponent = axios.post(
          process.env.NEXT_PUBLIC_API_URL + "/defi/get_opponent/",
          JSON.stringify({ id: request.data.opponentId }),
          { headers: { "Content-Type": "application/json" } }
        );
        opponent.then((opponent) => {
          if (opponent.data.success == true) {
            setOpponentImage(opponent.data.image);
            setOpponentName(opponent.data.name);
          } else {
            console.error(opponent.data.message);
          }
        });
      } else {
        console.error("??", request.data.error);
      }
    });
    const img = axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/defi/get_image/",
      JSON.stringify({ username: sessionStorage.getItem("username") }),
      { headers: { "Content-Type": "application/json" } }
    );
    img.then((img) => {
      if (img.data.success == true) {
        setUserImage(img.data.image);
      } else {
        console.error(img.data.message);
      }
    });
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket == null || roomNumber != 0) return;

    socket.on("joinedRoom", (message: any) => {
      // console.log(message);
    });

    socket.on("changeBet", (message: { newBet: number }) => {
      setOpponentBet(message.newBet);
    });

    socket.on("changeHonorBet", (message: { newHonorBet: boolean }) => {
      setOpponentHonorBet(message.newHonorBet);
    });

    socket.on("changeContract", (message: { newContract: string }) => {
      setMutualContract(message.newContract);
    });

    socket.on("changeGame", (message: { newGame: string }) => {
      setSelectedGame(message.newGame);
    });

    socket.on("changeAccept", (message: { userAccepted: boolean }) => {
      setOpponentAccepted(true);
    });

    socket.on("changeComment", (message: { newComment: string }) => {
      setOpponentComment(message.newComment);
    });

    socket.on("changeMode", (message: { newMode: boolean }) => {
      setIsPublic(message.newMode);
    });

    socket.on("challengeAccepted", () => {
      window.location.href = "/";
    });

    return () => {
      socket.emit("leave", { room: roomNumber });
      socket.off("message");
    };
  }, [socket]);

  useEffect(() => {
    setGainTotal(userBet + opponentBet);
  }, [userBet, opponentBet]);

  const handleUserBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > userBalance) {
      event.target.value = String(userBalance);
    }
    setUserBet(Number(event.target.value));
    socket.emit("changeBet", {
      newBet: Number(event.target.value),
      room: roomNumber,
      username: sessionStorage.getItem("username"),
    });
  };

  const handleContractChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMutualContract(event.target.value);
    socket.emit("changeContract", {
      newContract: event.target.value,
      room: roomNumber,
      username: sessionStorage.getItem("username"),
    });
  };

  function checkEveryInputs() {
    if (userBet != 0 && selectedGame != "") return 0;
  }

  const placeholder = "Loading...";

  const handleButtonClick = (e: any) => {
    e.preventDefault();
    alert("Vous ne pouvez pas cliquer sur le bouton de l'adversaire.");
  };

  const [isPublic, setIsPublic] = useState(true);
  const handleClick = () => {
    setIsPublic(!isPublic);
    socket.emit("changeMode", {
      newMode: !isPublic,
      room: roomNumber,
      username: sessionStorage.getItem("username"),
    });
  }
  return (
    <div className="h-full w-full ">
      {isClient ? (
        <div className="h-full w-full">
          <div className="transparent flex h-full w-full gap-4">
            <div className="flex h-full w-[30%] flex-col items-center justify-center bg-[#D9D9D9]">
              <div className="flex h-[45%] w-full flex-col items-center justify-center ">
                <img
                  className="mt-10 rounded-full border border-black shadow-md"
                  width={200}
                  height={200}
                  src={userImage}
                  alt="pic_me"
                />
                <p className="p-4 text-[22px] font-bold">
                  Wallet : {userBalance}
                </p>
              </div>
              <div className="h-[55%] w-full ">
                <form
                  action=""
                  className="flex flex-col items-center justify-center "
                >
                  <label htmlFor="mise" className="mb-2 text-[18px] font-bold">
                    Combien vas-tu miser ?
                  </label>
                  <input
                    type="number"
                    id="mise"
                    name="mise"
                    min="1"
                    placeholder="1"
                    className="w-[60%] rounded text-center text-[22px] font-bold"
                    onChange={handleUserBetChange}
                    value={userBet}
                  />
                  <textarea
                    name="chat"
                    id="chat"
                    cols={30}
                    rows={6}
                    className="my-4 w-[70%] resize-none rounded-sm border border-black p-2 text-[12px]"
                    placeholder="Ecris en live pour communiquer avec ton opposant, cette piece est en live..."
                    onChange={(e) => {
                      setUserComment(e.target.value)
                      socket.emit("changeComment", {
                        newComment: e.target.value,
                        room: roomNumber,
                        username: sessionStorage.getItem("username"),
                      });
                    }}
                    value={userComment}
                  ></textarea>
                  <div className="mb-2 flex gap-4">
                    <button
                      type="button"
                      className="rounded-md  bg-red-500 p-2 px-4 text-white"
                      onClick={() => {
                        if (checkEveryInputs() == 0) {
                          socket.emit("changeAccept", {
                            newAccept: true,
                            room: roomNumber,
                            username: sessionStorage.getItem("username"),
                          });
                          setUserAccepted(true);
                        }
                      }}
                    >
                      {userAccepted ? "En attente de l'adversaire" : "Refuser"}
                    </button>
                    <button
                      type="button"
                      className="rounded-md  bg-green-500 p-2 px-4 text-black"
                      onClick={() => {
                        if (checkEveryInputs() == 0) {
                          socket.emit("changeAccept", {
                            newAccept: true,
                            room: roomNumber,
                            username: sessionStorage.getItem("username"),
                          });
                          setUserAccepted(true);
                        }
                      }}
                    >
                      {userAccepted ? "En attente de l'adversaire" : "Accepter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex h-full w-[40%] flex-col">
              <div className="flex h-[35%] w-full flex-col items-center justify-center">
                <div className="flex w-full  items-center justify-center text-[60px] font-medium">
                  <p className="px-4">10:04</p>
                  <button className="h-4 w-4 rounded-full border border-black text-[10px]">
                    ?
                  </button>
                </div>
                <Image
                  src={vsImage}
                  alt="versus_symbol"
                  style={{ width: "50%", height: "auto" }}
                  className=" w-full"
                />
              </div>
              <div className="h-[65%] w-[98%] rounded-[15px] bg-[#D9D9D9] px-2">
                <div className="relative flex h-[10%] w-full">
                  <div className="h-full w-[33%] text-[22px] font-bold">
                    <div className="ml-2 mt-2 h-[58%] w-2/3 rounded-md bg-white flex text-[10px] p-[2px]">
                      <button onClick={handleClick} className={`w-1/2 transition-colors duration-200 ${isPublic ? 'bg-red-600 text-white' : ''} rounded-md`}>Public</button>
                      <button onClick={handleClick} className={`w-1/2 transition-colors duration-200 rounded-md ${!isPublic ? 'bg-red-600 text-white' : ''}`}>Private</button>
                    </div>
                  </div>
                  <h1 className="w-[33%] pt-2 text-center text-[22px] font-bold">
                    Gain total
                  </h1>
                  <div className="w-[33%]">
                    <p className="absolute border border-black right-2 top-2 h-4 w-4 rounded-full text-center text-[10px] font-medium">
                      ?
                    </p>
                  </div>
                </div>
                <div className="flex h-[30%] w-full flex-col items-center rounded">
                  <p className="w-[20%] rounded-md bg-white p-2 text-center">
                    {gainTotal}
                  </p>
                  <label htmlFor="game" className="text-[18px] font-bold">
                    Quel jeu allez-vous jouer ?
                  </label>
                  <select
                    className="mt-2 rounded"
                    id="game"
                    name="game"
                    required
                    onChange={handleGameChange}
                    value={selectedGame}
                  >
                    <option value="">Selectionnez un jeu</option>
                    <option value="Jeu de carte">Jeu de carte</option>
                    <option value="Jeu de flechette">Jeu de flechette</option>
                    <option value="Echec">Echec</option>
                  </select>
                </div>
                <div className=" flex h-[60%] w-full flex-col items-center">
                  <p className="h-[20%]text-center font-mono">Termes du defi</p>
                  <textarea
                    className="h-[85%] w-full resize-none rounded-md border border-gray-400 p-2 placeholder:text-[12px] text-left placeholder:text-left"
                    placeholder={`Ecrivez les termes de votre defi, faites preuve de creativite car vous pouvez parier tout et n'importe quoi !

ex: pierre feuille ciseau, le premier en 5 points gagne la mise du defi.

ex: le premier qui finit minishell gagne la mise du defi.

ex: on va faire 3 parties d'echecs, celui qui gagne 2 parties remporte la mise du defi`}
                    value={mutualContract}
                    onChange={handleContractChange}
                  />
                </div>
                <div className="h-[0%]">
                  <button className="hidden rounded bg-red-500 p-2 font-mono font-bold">
                    HideAcceptedButton
                  </button>
                </div>
              </div>
            </div>
            <div className="flex h-full w-[30%] flex-col items-center justify-center bg-[#D9D9D9]">
              <div className="flex h-[45%] w-full flex-col items-center justify-center ">
                <img
                  className="mt-10 rounded-full border border-black shadow-md"
                  width={200}
                  height={200}
                  src={opponentImage}
                  alt="pic_me"
                />
                <p className="p-4 text-[22px] font-bold">
                  Wallet : {opponentBalance}
                </p>
              </div>
              <div className="h-[55%] w-full ">
                <form
                  action=""
                  className="flex flex-col items-center justify-center "
                >
                  <label htmlFor="mise" className="mb-2 text-[18px] font-bold">
                    Combien vas-tu miser ?
                  </label>
                  <input
                    type="number"
                    id="mise"
                    name="mise"
                    min="1"
                    placeholder="1"
                    readOnly
                    className="w-[60%] rounded text-center text-[22px] font-bold"
                    value={opponentBet}
                  />
                  <textarea
                    name="chat"
                    id="chat"
                    cols={30}
                    rows={6}
                    readOnly
                    className="my-4 w-[70%] resize-none rounded-sm border border-black p-2 text-[12px]"
                    placeholder="Ecris en live pour communiquer avec ton opposant, cette piece est en live..."
                    value={opponentComment}
                  ></textarea>
                  <div className="mb-2 flex gap-4">
                    <button
                      type="button"
                      className="rounded-md  bg-red-500 p-2 px-4 text-white"
                      onClick={() => {
                        if (checkEveryInputs() == 0) {
                          socket.emit("changeAccept", {
                            newAccept: true,
                            room: roomNumber,
                            username: sessionStorage.getItem("username"),
                          });
                          setUserAccepted(true);
                        }
                      }}
                    >
                      {userAccepted ? "En attente de l'adversaire" : "Refuser"}
                    </button>
                    <button
                      type="button"
                      className="rounded-md  bg-green-500 p-2 px-4 text-black"
                      onClick={() => {
                        if (checkEveryInputs() == 0) {
                          socket.emit("changeAccept", {
                            newAccept: true,
                            room: roomNumber,
                            username: sessionStorage.getItem("username"),
                          });
                          setUserAccepted(true);
                        }
                      }}
                    >
                      {userAccepted ? "En attente de l'adversaire" : "Accepter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>{placeholder}</div>
      )}
    </div>
  );
}

export default DefiPage;
