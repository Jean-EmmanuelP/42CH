"use client";

import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import GlobalContext from "~/context/GlobalContext";
import vsImage from "../../utils/images/vs.jpg";
import { api } from "~/utils/api";
import Image from "next/image";
import io from 'socket.io-client';
import axios from "axios";
import { set } from "lodash";

function DefiPage() {
  // need to fix this
  // const router = useRouter()
  // const path = router.asPath
  // const roomNumber = path.split('/').pop()
  const roomNumber = 123;
  const { challengeData } = useContext(GlobalContext);
  const [isClient, setIsClient] = useState(false);
  const [gainTotal, setGainTotal] = useState<number>(0);
  const [userBet, setUserBet] = useState<number>(0);
  const [opponentBet, setOpponentBet] = useState<number>(0);
  const [mutualContract, setMutualContract] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>('');
  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(event.target.value)
    socket.emit('changeGame', { newGame: event.target.value, room: roomNumber, username: sessionStorage.getItem('username') })
  };
  const [honorBet, setHonorBet] = useState<boolean>(false);
  const [opponentHonorBet, setOpponentHonorBet] = useState<boolean>(false);
  const handleHonorBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHonorBet(event.target.checked)
    socket.emit('changeHonorBet', { newHonorBet: event.target.checked, room: roomNumber, username: sessionStorage.getItem('username') })
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
    setIsClient(true);
    // check if id is in the url and exists in the database
    const request = axios.post('http://localhost:3333/defi/get_infos/', JSON.stringify({ username: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } })
    request.then((request) => {
      if (request.data.success == true) {
        setUserBet(request.data.userBet)
        setOpponentBet(request.data.opponentBet)
        setHonorBet(request.data.honorBet)
        setOpponentHonorBet(request.data.opponentHonorBet)
        setOpponentAccepted(request.data.opponentAccepted)
        setUserAccepted(request.data.userAccepted)
        setMutualContract(request.data.mutualContract)
        setSelectedGame(request.data.selectedGame)
        setUserBalance(request.data.balance)
        setOpponentBalance(request.data.opponentBalance)
        setUserImage(request.data.image)
        // faire qqch avec request.data.opponenttId
        const opponent = axios.post('http://localhost:3333/defi/get_opponent/', JSON.stringify({ id: request.data.opponentId }), { headers: { 'Content-Type': 'application/json' } })
        opponent.then((opponent) => {
          if (opponent.data.success == true) {
            setOpponentImage(opponent.data.image)
            setOpponentName(opponent.data.name)
          }
          else {
            console.error(opponent.data.message)
          }
        })
      }
      else {
        console.error(request.data.message)
      }
    })
    const img = axios.post('http://localhost:3333/defi/get_image/', JSON.stringify({ username: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } })
    img.then((img) => {
      if (img.data.success == true) {
        setUserImage(img.data.image)
      }
      else {
        console.error(img.data.message)
      }
    })
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

    socket.on('changeAccept', (message: { userAccepted: boolean }) => {
      setOpponentAccepted(true);
    })

    socket.on('challengeAccepted', () => {
      window.location.href = "/"
    })

    socket.emit('join', { room: roomNumber })

    return () => {
      socket.emit('leave', { room: roomNumber });
      socket.off('message');
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
    socket.emit('changeBet', { newBet: Number(event.target.value), room: roomNumber, username: sessionStorage.getItem('username') })
  };

  const handleContractChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMutualContract(event.target.value);
    socket.emit('changeContract', { newContract: event.target.value, room: roomNumber, username: sessionStorage.getItem('username') })
  };

  function checkEveryInputs() {
    if (userBet != 0 && selectedGame != '')
      return 0;
  }


  const placeholder = "Loading...";

  return (
    <div>
      {isClient ? (
        <>
          <div className="ml-2 mr-2 mt-4 flex space-x-4 bg-gray-500">
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-400/95 p-10">
              <img
                className="rounded-full shadow-xl"
                src={userImage}
                alt="pic_me"
              />
              <p className="p-4">
                Balance : {userBalance}
              </p>
              <form
                action=""
                className="flex flex-col items-center justify-center border border-black pt-2"
              >
                <label htmlFor="mise">
                  Mise de {sessionStorage.getItem('username')} :
                </label>

                <input
                  type="number"
                  id="mise"
                  name="mise"
                  min="1"
                  placeholder="1"
                  className="mt-2 rounded p-2"
                  onChange={handleUserBetChange}
                  value={userBet}
                />
                <label htmlFor="honorBet">Miser sur l'honneur</label>
                <input
                  type="checkbox"
                  id="honorBet"
                  name="honorBet"
                  onChange={handleHonorBetChange}
                  checked={honorBet}
                />
                <button
                  type="button"
                  className="mt-40 rounded bg-blue-500 p-2 text-white"
                  onClick={() => {
                    if (checkEveryInputs() == 0) {
                      socket.emit('changeAccept', { newAccept: true, room: roomNumber, username: sessionStorage.getItem('username') })
                      setUserAccepted(true);
                    }
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
                <option value="Jeu de carte">Jeu de carte</option>
                <option value="Jeu de flechette">Jeu de flechette</option>
                <option value="Echec">Echec</option>
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
                src={opponentImage}
                alt="pic_me"
              />
              <p className="p-4">
                Balance :{opponentBalance}
              </p>
              <form
                action=""
                className="flex flex-col items-center justify-center border border-black p-2"
              >
                <label htmlFor="mise">
                  Mise de {opponentName}
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
                // onClick={() => setOpponentAccepted(true)}
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