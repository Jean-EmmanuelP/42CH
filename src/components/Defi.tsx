import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GlobalContext from "~/context/GlobalContext";
import Pusher from "pusher-js";
import { api } from "~/utils/api";
import axios from "axios";
import { createReactProxyDecoration } from "@trpc/react-query/shared";
import Modal from "./Modal";
import DefiModalContent from "./DefiModalContent";
import io from 'socket.io-client';

const DefiRightBar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { setChallengeData } = useContext(GlobalContext);

  // State
  const userId = session?.user.id || "";
  const username = session?.user.name || "";
  const [challenges, setChallenges] = useState<string[]>([]);
  const [creatorId, setCreatorId] = useState<string>("");
  const [challengeArray, setChallengeArray] = useState<any[]>([]);
  const [defiRequestArray, setDefiRequestArray] = useState<any[]>([]);
  const [showModalFin, setShowModalFin] = useState<boolean>(false);
  const [challengeOpened, setChallengeOpened] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    console.log('useEffect')
    const request = axios.post('http://localhost:3333/defi/get_all_challenges/',
      JSON.stringify({ username: sessionStorage.getItem('username') }),
      { headers: { 'Content-Type': 'application/json' } })
    request.then((response) => {
      if (response.data.success === true)
        setChallengeArray(response.data.challenges);
      else {
        console.error(response.data.error)
      }
    })
    fetchDefiRequestArray()

    const socket = io(`http://localhost:3111`, {
      transports: ['websocket'],
    });
    setSocket(socket)
  }, [username])

  useEffect(() => {
    if (socket == null)
      return
    socket.emit('joinDefi', { username: username })

    socket.on('receiveDefi', () => {
      fetchDefiRequestArray()
    })

    socket.on('receiveDefiId', (data: { defiId: string }) => {
      window.location.href = '/defi/' + data.defiId;
    })

    return () => {
      socket.emit('leaveDefi', { username: username })
      socket.disconnect()
      socket.off()
    }
  }, [username])

  async function fetchDefiRequestArray() {
    const request = await axios.post('http://localhost:3333/defi/get_all_defi_requests', JSON.stringify({ username: username }), { headers: { 'Content-Type': 'application/json' } })
    if (request.data.success === true) {
      console.log(request.data.defiRequests)
      setDefiRequestArray(request.data.defiRequests)
    }
    else
      console.error(request.data.error)
  }
  const handleAcceptChallenge = async (index: number) => {
    const request = await axios.post('http://localhost:3333/defi/create',
      JSON.stringify({ creatorUsername: defiRequestArray[index].senderUsername, opponentUsername: username, }),
      { headers: { 'Content-Type': 'application/json' } })
    if (request.data.success === true) {
      // will need to add another way to join a defi requets later
      socket.emit('sendDefiId', { toDelete: defiRequestArray[index].id, username: defiRequestArray[index].senderUsername, defiId: request.data.defiId })
      window.location.href = '/defi/' + request.data.defiId;
    }
  };

  const handleRejectChallenge = (index: number) => {
    const request = axios.post('http://localhost:3333/defi/delete_defi_request/', JSON.stringify({ id: defiRequestArray[index].id }), { headers: { 'Content-Type': 'application/json' } })
    request.then((response) => {
      if (response.data.success === true) {
        fetchDefiRequestArray()
      }
      else {
        console.error(response.data.error)
      }
    })
    //   setChallenges((prevChallenges) => {
    //     const newChallenges = prevChallenges.filter(
    //       (_, index) => index !== challengeIndex
    //     );
    //     localStorage.setItem("challenges", JSON.stringify(newChallenges));
    //     return newChallenges;
    //   });
  };

  function extractUsername(email: string) {
    return email.split(" ")[0];
  }

  function sumUp(number1: number, number2: number) {
    return number1 + number2;
  }
  // Render
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-md mt-4 shadow-md bg-white p-5">
      <div>
        <h2 className="text-2xl font-bold">Mes defis</h2>
      </div>
      <div className="bg-white-600 h-full w-full mb-3 overflow-y-auto">
        {defiRequestArray ? (<p className="mb-2">Demande de defi</p>) : (<></>)}
        {defiRequestArray.map((defiRequest, index) => {
          return (
            <div
              key={index}
              className="m-5 flex flex-col items-center gap-4 rounded bg-white p-5 shadow-md"
            >
              <p className="mb-2 text-l font-semibold">{defiRequest.receiverUsername}</p>
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
        }
        )}
        {challengeArray ? (<p className="mb-2">Defi en cours</p>) : (<></>)}
        {challengeArray.map((challenge, index) => {
          return (
            <div className="text-sm w-full border border-gray rounded-md pt-2 pl-2 pb-2 shadow-sm">
              <p className="border-b border-gray p-2">You vs {extractUsername(challenge.opponentName)} a changer</p>
              <div className="p-2 flex flex-col gap-2">
                <p className="">Jeu : {challenge.gameSelected}</p>
                <p className="">Enjeu : {sumUp(challenge.creatorBid, challenge.opponentBid)} coin</p>
              </div>
              {(challenge.creatorName == sessionStorage.getItem('username') && challenge.creatorAnswer == false)
                || (challenge.opponentName == sessionStorage.getItem('username') && challenge.opponentAnswer == false) ? (
                <button onClick={() => { setShowModalFin(true); setChallengeOpened(challenge) }}
                  className="bg-black/25 border border-red-500 text-red-500 shadow-sm p-2 rounded-md justify-center ml-2 items-center tracking-wide">Fin du DEFI</button>
              ) : <p>En attente de l'adversaire...</p>}
            </div>
          )
        }
        )}
      </div>
      <div className="self-center mb-4 pb-6">
        <button
          type="button"
          className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => setShowModal(true)}
        >
          DEFI
        </button>
      </div>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <DefiModalContent socket={socket} onClose={() => setShowModal(false)} />
      </Modal>
      <Modal isVisible={showModalFin} onClose={() => setShowModalFin(false)}>
        <div className="items-center gap-2">
          <p className="items-center text-xl font-bold block">Qui a gagné ?</p>
          {challengeOpened != null ?
            (
              <>
                <button onClick={async () => {
                  const request = await axios.post('http://localhost:3333/defi/finish', JSON.stringify({ username: sessionStorage.getItem('username'), challengeId: challengeOpened.id, winner: challengeOpened.creatorName }), { headers: { 'Content-Type': 'application/json' } })
                  setShowModalFin(false)
                  window.location.href = '/';
                }}
                  className="border border-black inline text-xl">{challengeOpened?.creatorName}</button>
                <button onClick={async () => {
                  const request = await axios.post('http://localhost:3333/defi/finish', JSON.stringify({ username: sessionStorage.getItem('username'), challengeId: challengeOpened.id, winner: challengeOpened.opponentName }), { headers: { 'Content-Type': 'application/json' } })
                  setShowModalFin(false)
                  window.location.href = '/';
                }}
                  className="border border-black sticky text-xl inline right-0">{challengeOpened?.opponentName}</button>
              </>
            ) : (<></>)

          }
        </div>
      </Modal>
    </div>
  );
};
export default DefiRightBar;
