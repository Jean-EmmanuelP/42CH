"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import GlobalContext from "~/context/GlobalContext";
import vsImage from "../../utils/images/vs.jpg";
import { api } from "~/utils/api";
import Image from "next/image";
import io from 'socket.io-client';

function DefiPage() {
  let roomNumber = 123;
  const { challengeData } = useContext(GlobalContext);
  const [isClient, setIsClient] = useState(false);
  const [gainTotal, setGainTotal] = useState<number>(0);
  const [userBet, setUserBet] = useState<number>(0);
  const [opponentBet, setOpponentBet] = useState<number>(0);
  const [mutualContract, setMutualContract] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>('');
  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(event.target.value)
    socket.emit('changeGame', { newGame: event.target.value, room: roomNumber })
  };
  const [honorBet, setHonorBet] = useState<boolean>(false);
  const [opponentHonorBet, setOpponentHonorBet] = useState<boolean>(false);
  const handleHonorBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHonorBet(event.target.checked)
    socket.emit('changeHonorBet', { newHonorBet: event.target.checked, room: roomNumber })
  };
  const [userAccepted, setUserAccepted] = useState<boolean>(false);
  const [opponentAccepted, setOpponentAccepted] = useState<boolean>(false);
  const [opponentId, setOpponnentId] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  // backend in nextjs port 3000, file handling socket /api/socket
  // console.log(challengeData);


  const {
  data: UserResponse,
    error: UserError,
    isLoading: UserIsLoading,
  } = api.defi.getUserDataByName.useQuery({
    name: challengeData ? challengeData[1] : "",
  });

  const {
    data: OpponentResponse,
    error: OpponentError,
    isLoading: OpponentIsLoading,
  } = api.defi.getUserDataByName.useQuery({
    name: challengeData ? challengeData[2] : "",
  });

  useEffect(() => {
    setIsClient(true);

    const socket = io(`http://localhost:3111`, {
      transports: ['websocket'],
    });

    setSocket(socket);

  }, []);

  useEffect(() => {
    if (socket == null) return;

    socket.on('joinedRoom', (message: any) => {
      console.log(message);
    });

    socket.on('changeBet', (message: { newBet: number }) => {
      setOpponentBet(message.newBet);
    });

    socket.on('changeHonorBet', (message: { newHonorBet: boolean }) => {
      setOpponentHonorBet(message.newHonorBet);
    });

    socket.on('changeContract', (message: { newContract: string }) => {
      setMutualContract(message.newContract);
    });

    socket.on('changeGame', (message: { newGame: string }) => {
      setSelectedGame(message.newGame);
    });

    socket.emit('join', { room: 123 })//, username: UserResponse?.name, opponentUsername: OpponentResponse?.name });

    return () => {
      socket.emit('leave', { room: 123 });
      socket.off('message');
    };
  }, [socket]);

  useEffect(() => {
    setGainTotal(userBet + opponentBet);
  }, [userBet, opponentBet]);

  useEffect(() => {
    if (userAccepted && opponentAccepted) {
      // Envoyez ici les informations du pari
    }
  }, [userAccepted, opponentAccepted]);

  const handleUserBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserBet(Number(event.target.value));
    socket.emit('changeBet', { newBet: Number(event.target.value), room: roomNumber })
  };

  const handleContractChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMutualContract(event.target.value);
    socket.emit('changeContract', { newContract: event.target.value, room: roomNumber })
  };

  const placeholder = "Loading...";

  return (
    <div>
      {isClient ? (
        <>
          <div className="ml-2 mr-2 mt-4 flex space-x-4 bg-gray-500">
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-400/95 p-10">
              <img
                className="rounded-full shadow-xl"
                src={UserResponse ? UserResponse.image || "" : ""}
                alt="pic_me"
              />
              <p className="p-4">
                Balance : {UserResponse ? UserResponse.balance || "0" : "0"}
              </p>
              <form
                action=""
                className="flex flex-col items-center justify-center border border-black p-2"
              >
                <label htmlFor="mise">
                  Mise de {UserResponse ? UserResponse.name || "" : ""} :
                </label>

                <input
                  type="number"
                  id="mise"
                  name="mise"
                  min="1"
                  placeholder="1"
                  className="mt-2 rounded p-2"
                  onChange={handleUserBetChange}
                />
                <label htmlFor="honorBet">Miser sur l'honneur</label>
                <input
                  type="checkbox"
                  id="honorBet"
                  name="honorBet"
                  onChange={handleHonorBetChange}
                />
                <button
                  type="button"
                  className="mt-40 rounded bg-blue-500 p-2 text-white"
                  onClick={() => {
                    setUserAccepted(true);
                    // notifyUserAccepted.mutate({userId:  user})
                  }}
                >
                  {userAccepted ? "En attente de l'adversaire" : "Accepter"}
                </button>
              </form>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-blue-500 p-10">
              <Image
                src={vsImage}
                alt="versus_symbol"
                style={{ width: "50%", height: "auto" }}
              />
              <label htmlFor="game">Quel jeu allez-vous jouer ?</label>
              <select className="mt-2 rounded" id="game" name="game" required onChange={handleGameChange} value={selectedGame}>
                <option value="">--Sélectionnez un jeu--</option>
                <option value="game1">Jeu de carte</option>
                <option value="game2">Jeu de flechette</option>
                <option value="game3">Echec</option>
              </select>
              <div className="rounded border border-black bg-white p-2 text-center">
                <h1 className="underline">Gain total:</h1>
                <p>{gainTotal}</p>
              </div>
              <div className="">
                <p className="text-center font-mono">Termes du contrat : </p>
                <textarea
                  className="mt-2 h-32 w-full rounded border border-black p-2"
                  placeholder="Ecrivez le contrat de votre pari, vous pouvez parier tout et n'importe quoi, soyez creatif !"
                  value={mutualContract}
                  onChange={handleContractChange}
                />
                <button className="bg-red-500 rounded p-2 font-bold font-mono hidden">HideAcceptedButton</button>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-400/95 p-10">
              <img
                className="rounded-full shadow-xl"
                src={OpponentResponse ? OpponentResponse.image || "" : ""}
                alt="pic_me"
              />
              <p className="p-4">
                Balance :{" "}
                {OpponentResponse ? OpponentResponse.balance || "0" : "0"}
              </p>
              <form
                action=""
                className="flex flex-col items-center justify-center border border-black p-2"
              >
                <label htmlFor="mise">
                  Mise de {OpponentResponse ? OpponentResponse.name || "" : ""}{" "}
                  :
                </label>
                <input
                  type="number"
                  id="mise"
                  name="mise"
                  min="1"
                  placeholder="1"
                  className="mt-2 rounded p-2"
                  /*value that changes with the opponentBet state*/
                  value={opponentBet}
                />
                <label htmlFor="honorBet">Miser sur l'honneur</label>
                <input
                  type="checkbox"
                  id="honorBet"
                  name="honorBet"
                  onChange={handleHonorBetChange}
                  checked={opponentHonorBet} />
                <button
                  type="button"
                  className="mt-40 rounded bg-blue-500 p-2 text-white"
                  onClick={() => setOpponentAccepted(true)}
                >
                  {opponentAccepted ? 'Prêt' : 'Accepter'}
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div>{placeholder}</div>
      )}
    </div>
  );
}

export default DefiPage;